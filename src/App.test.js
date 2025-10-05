import { render, screen } from '@testing-library/react';
import App from './App';

test('başlığı ve harita bileşenini render eder', () => {
  render(<App />);

  const headerTitles = screen.getAllByText(/clean breathing/i);
  expect(headerTitles.length).toBeGreaterThan(0);

  const citySelect = screen.getByLabelText(/şehir seçin/i);
  expect(citySelect).toBeInTheDocument();
});
