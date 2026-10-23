import { render } from '@testing-library/react-native';
import { KuralCard } from '../KuralCard';
import { LightColors } from '@/themes/Colors';

it('places report failure feedback immediately after the report action', async () => {
  const screen = await render(
    <KuralCard
      title="Kural"
      numberText="1"
      numberLabel="Kural 1"
      adhikaramName="Chapter"
      lines={['First line', 'Second line']}
      meaning={'Long meaning. '.repeat(100)}
      unverifiedLabel="Unverified"
      reportLabel="Report"
      onReport={jest.fn()}
      reportError="Could not open report"
      colors={LightColors}
    />,
  );
  const report = screen.getByRole('link');
  const feedback = screen.getByRole('alert');
  expect(report.parent).toBe(feedback.parent);
  const siblings = report.parent!.children;
  expect(siblings.indexOf(feedback)).toBe(siblings.indexOf(report) + 1);
});
