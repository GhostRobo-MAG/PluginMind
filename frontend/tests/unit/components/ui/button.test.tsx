import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground', 'h-9', 'px-4', 'py-2')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive', 'text-destructive-foreground')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border', 'border-input', 'bg-transparent')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary', 'text-secondary-foreground')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-primary', 'underline-offset-4')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8', 'rounded-md', 'px-3', 'text-xs')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10', 'rounded-md', 'px-8')

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toHaveClass('size-9', 'rounded-full', 'text-sm')
  })

  it('renders as disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('renders as different HTML element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )

    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not handle click events when disabled', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button disabled onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className along with default classes', () => {
    render(<Button className="custom-class">Custom</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center') // Default classes should still be present
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()

    render(<Button ref={ref}>Button with ref</Button>)

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })

  it('spreads additional props', () => {
    render(
      <Button
        data-testid="custom-button"
        aria-label="Custom label"
        type="submit"
      >
        Test
      </Button>
    )

    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('renders loading state correctly', () => {
    render(
      <Button>
        <svg className="animate-spin mr-2 h-4 w-4" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        </svg>
        Loading...
      </Button>
    )

    const button = screen.getByRole('button', { name: /loading/i })
    expect(button).toBeInTheDocument()

    const spinner = button.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-hidden', 'true')
  })

  it('maintains accessibility standards', () => {
    render(<Button aria-label="Accessible button">🔥</Button>)

    const button = screen.getByRole('button', { name: /accessible button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Accessible button')
  })

  it('supports keyboard navigation', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Keyboard accessible</Button>)

    const button = screen.getByRole('button')

    // Focus the button
    await user.tab()
    expect(button).toHaveFocus()

    // Trigger with Enter key
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)

    // Trigger with Space key
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('renders with complex children including icons', () => {
    render(
      <Button>
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </Button>
    )

    const button = screen.getByRole('button', { name: /add item/i })
    expect(button).toBeInTheDocument()

    const icon = button.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('w-4', 'h-4', 'mr-2')
  })
})