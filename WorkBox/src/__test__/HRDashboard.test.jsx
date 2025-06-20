import { render, screen } from '@testing-library/react';
import HRDashboard from '../pages/HRDashboard';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

vi.mock('js-cookie');
vi.mock('axios');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('HRDashboard basic rendering', () => {
  beforeEach(() => {
    Cookies.get.mockReturnValue(
      'fake.header.' + btoa(JSON.stringify({ firstName: 'Ajna', uuid: '1234' })) + '.signature'
    );
  });

  test('renders navbar with welcome message and logout button', () => {
    renderWithRouter(<HRDashboard />);
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('renders main header', () => {
    renderWithRouter(<HRDashboard />);
    expect(screen.getByText(/HR Dashboard/i)).toBeInTheDocument();
  });

  test('renders DashboardCards component', () => {
    renderWithRouter(<HRDashboard />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('renders charts containers', () => {
    renderWithRouter(<HRDashboard />);
    expect(screen.getByText(/HR Dashboard/i)).toBeInTheDocument();
    expect(document.querySelector('.row')).toBeInTheDocument();
  });
});
