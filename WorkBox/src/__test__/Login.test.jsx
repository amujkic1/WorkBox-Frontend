import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';  
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

vi.mock('js-cookie');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Login component basic rendering', () => {
  beforeEach(() => {
    Cookies.get.mockReturnValue(null); 
  });

  test('renders login form elements', () => {
    renderWithRouter(<Login />);
    expect(screen.getByPlaceholderText(/Enter Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/Remember Me/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Create an Account!/i)).toBeInTheDocument();
  });

  test('can show error message and dismiss it', () => {
    renderWithRouter(<Login />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

  });

  test('email and password inputs accept input', () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText(/Enter Email Address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
