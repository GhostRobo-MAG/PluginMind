import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ContactForm } from '@/components/forms/contact-form'
import { render } from '../../../utils/test-utils'

jest.mock('@/actions/email', () => ({
  submitContactForm: jest.fn(),
}))

const mockToast = jest.fn()

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

const { submitContactForm } = require('@/actions/email')

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToast.mockClear()
  })

  const renderForm = () => render(<ContactForm />)

  const fillValidForm = async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Test message')
    return user
  }

  it('renders the expected fields', () => {
    renderForm()

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('prevents submission when validation fails', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(submitContactForm).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(
        screen.getByText(/email must be made of at least 5 characters/i)
      ).toBeInTheDocument()
    })
  })

  it('submits valid data and shows success toast', async () => {
    submitContactForm.mockResolvedValue('success')
    renderForm()

    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(submitContactForm).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Test message',
      })
    })

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Thank you!',
        description: 'Your message has been sent',
      })
    })

    expect(screen.getByLabelText(/name/i)).toHaveValue('')
    expect(screen.getByLabelText(/email/i)).toHaveValue('')
    expect(screen.getByLabelText(/message/i)).toHaveValue('')
  })

  it('shows destructive toast when action returns an error status', async () => {
    submitContactForm.mockResolvedValue('error')
    renderForm()

    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Something went wrong',
        description: 'Please try again',
        variant: 'destructive',
      })
    })
  })

  it('surfaces unexpected failures', async () => {
    submitContactForm.mockRejectedValue(new Error('Network error'))
    renderForm()

    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: 'Something went wrong. Please try again',
        variant: 'destructive',
      })
    })
  })
})
