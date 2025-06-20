import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Records from '../pages/Records';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

vi.mock('axios');
vi.mock('js-cookie');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Records', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Cookies.get.mockReturnValue(
      'fake.header.' + btoa(JSON.stringify({ firstName: 'Ajna', uuid: '1234' })) + '.signature'
    );

    // Mock fetch za records i users
    global.fetch = vi.fn((url) => {
      if (url.includes('records')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            _embedded: {
              recordDTOList: [
                {
                  id: 1,
                  userUuid: 'uuid-1',
                  status: 'ACTIVE',
                  workingHours: 8,
                  employmentDate: new Date().toISOString(),
                },
              ]
            }
          })
        });
      }

      if (url.includes('users')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            _embedded: {
              userDTOList: [
                {
                  id: 1,
                  uuid: 'uuid-1',
                  firstName: 'Ajna',
                  lastName: 'Mujkić'
                }
              ]
            }
            
          })
        });
      }

      if (url.includes('employee_benefit')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { type: 'zdravstvo' }
          ])
        });
      }

      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  test('renders navbar and welcome message', async () => {
    renderWithRouter(<Records />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('displays records table with one record', async () => {
    renderWithRouter(<Records />);
    expect(await screen.findByText(/Ajna Mujkić/i)).toBeInTheDocument();
    expect(screen.getByText(/Working Hours:/i)).toBeInTheDocument();
  });

  test('opens and closes edit modal', async () => {
    renderWithRouter(<Records />);
    const editButton = await screen.findByRole('button', { name: /✏️/i });
    fireEvent.click(editButton);

    expect(screen.getByText(/Edit Record/i)).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: '' }); // btn-close nema text
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/Edit Record/i)).not.toBeInTheDocument();
    });
  });
});
