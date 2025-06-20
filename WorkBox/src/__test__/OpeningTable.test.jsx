import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import OpeningTable from '../components/dashboard/OpeningTable';
import { vi } from 'vitest';

vi.mock('../forms/OpeningForm', () => ({
  default: () => <div>OpeningFormMock</div>
}));

beforeAll(() => {
  vi.spyOn(window, 'confirm').mockImplementation(() => true);
});

afterAll(() => {
  window.confirm.mockRestore();
});

describe('OpeningTable basic rendering and actions', () => {
  const sampleOpenings = [
    {
      id: 1,
      openingName: 'Frontend Developer',
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-01-31T00:00:00Z',
      applicationCount: 5,
      status: 'Active'
    },
    {
      id: 2,
      openingName: 'Backend Developer',
      startDate: '2025-02-01T00:00:00Z',
      endDate: '2025-02-28T00:00:00Z',
      applicationCount: 3,
      status: 'Inactive'
    }
  ];

  test('renders table with no openings message when openings is empty', () => {
    render(<OpeningTable openings={[]} onRefreshOpenings={vi.fn()} />);
    expect(screen.getByText(/No openings right now/i)).toBeInTheDocument();
  });

  test('renders openings data properly', () => {
    render(<OpeningTable openings={sampleOpenings} onRefreshOpenings={vi.fn()} />);

    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();

    const activeBadge = screen.getByText('Active');
    expect(activeBadge).toHaveClass('bg-success');

    const inactiveBadge = screen.getByText('Inactive');
    expect(inactiveBadge).toHaveClass('bg-secondary');
  });

test('shows delete alert after successful deletion and calls onRefreshOpenings', async () => {
  const mockRefresh = vi.fn();

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
    })
  );

  render(<OpeningTable openings={sampleOpenings} onRefreshOpenings={mockRefresh} />);

  fireEvent.click(screen.getAllByText('Close')[0]);

  await waitFor(() =>
    expect(screen.getByText(/Opening has been deleted/i)).toBeInTheDocument()
  );

  const alert = screen.getByRole('alert');

  const closeButton = alert.querySelector('button.btn-close');

  fireEvent.click(closeButton);

  expect(screen.queryByText(/Opening has been deleted/i)).not.toBeInTheDocument();

  expect(mockRefresh).toHaveBeenCalled();

  global.fetch.mockRestore();
});


});
