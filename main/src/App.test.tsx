import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'

describe('App routing', () => {
  it('renders the home page and updates the counter', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />}> 
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument()

    const incrementButton = screen.getByRole('button', { name: '+' })
    const counter = screen.getByText('0')

    await user.click(incrementButton)
    expect(counter).toHaveTextContent('1')
  })

  it('navigates to the About page', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />}> 
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    const aboutLink = screen.getByRole('link', { name: /about/i })
    await user.click(aboutLink)

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })
})
