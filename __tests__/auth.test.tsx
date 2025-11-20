import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignInPage from '@/app/auth/signin/page'
import SignUpPage from '@/app/auth/signup/page'
import { signIn } from 'next-auth/react'

// Mock next-auth signIn
jest.mock('next-auth/react')

describe('Authentication', () => {
  describe('Sign In Page', () => {
    it('renders sign in form', () => {
      render(<SignInPage />)

      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
    })

    it('validates required fields', async () => {
      render(<SignInPage />)

      const submitButton = screen.getByRole('button', { name: /^sign in$/i })
      fireEvent.click(submitButton)

      // HTML5 validation will prevent submission
      const emailInput = screen.getByPlaceholderText(/you@example.com/i) as HTMLInputElement
      expect(emailInput.validity.valid).toBe(false)
    })

    it('submits form with valid credentials', async () => {
      const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockSignIn.mockResolvedValue({ ok: true, error: null } as any)

      render(<SignInPage />)

      const emailInput = screen.getByPlaceholderText(/you@example.com/i)
      const passwordInput = screen.getByPlaceholderText(/••••••••/)
      const submitButton = screen.getByRole('button', { name: /^sign in$/i })

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
          email: 'test@example.com',
          password: 'password123',
          redirect: false,
        })
      })
    })
  })

  describe('Sign Up Page', () => {
    it('renders sign up form', () => {
      render(<SignUpPage />)

      expect(screen.getByText(/create your account and start practicing/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument()
    })

    it('validates password length', async () => {
      render(<SignUpPage />)

      const passwordInput = screen.getByPlaceholderText(/••••••••/) as HTMLInputElement

      // Check that it has minlength attribute
      expect(passwordInput.getAttribute('minlength')).toBe('8')
    })

    it('submits form with valid data', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: { id: '1', email: 'test@example.com' } }),
        })
      ) as jest.Mock

      render(<SignUpPage />)

      const nameInput = screen.getByPlaceholderText(/john doe/i)
      const emailInput = screen.getByPlaceholderText(/you@example.com/i)
      const passwordInput = screen.getByPlaceholderText(/••••••••/)
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      fireEvent.change(nameInput, { target: { value: 'Test User' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/signup', expect.any(Object))
      })
    })
  })
})
