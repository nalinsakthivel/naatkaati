import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { WidgetModel } from '@/calendar/widgetModel';
import { LightColors } from '@/themes/Colors';

interface NaatkaatiWidgetProps {
  model: WidgetModel;
  yearLabel: string;
}

/** The widget library only accepts #-prefixed hex colours, so tokens are normalised to that type. */
const hex = (value: string): `#${string}` => `#${value.replace('#', '')}`;

const DATE_SIZE = 44;
const BODY_SIZE = 14;
const CAPTION_SIZE = 12;
const PAD = 12;
const RADIUS = 16;
const HOLIDAY_GAP = 4;

/** Home-screen widget: today's Tamil date, any holiday, and the kural of the day. */
export function NaatkaatiWidget({ model, yearLabel }: NaatkaatiWidgetProps) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'row',
        backgroundColor: hex(LightColors.surface),
        borderRadius: RADIUS,
        borderColor: hex(LightColors.border),
        borderWidth: 1,
      }}
    >
      <FlexWidget
        style={{
          width: 100,
          height: 'match_parent',
          backgroundColor: hex(LightColors.primary),
          borderTopLeftRadius: RADIUS,
          borderBottomLeftRadius: RADIUS,
          justifyContent: 'center',
          alignItems: 'center',
          padding: PAD,
        }}
      >
        <TextWidget
          text={model.day}
          style={{ fontSize: DATE_SIZE, color: hex(LightColors.textOnPrimary), fontWeight: 'bold' }}
        />
        <TextWidget
          text={model.monthName}
          style={{ fontSize: BODY_SIZE, color: hex(LightColors.textOnPrimary) }}
        />
        <TextWidget
          text={yearLabel}
          style={{ fontSize: CAPTION_SIZE, color: hex(LightColors.textOnPrimary) }}
        />
      </FlexWidget>
      <FlexWidget
        style={{ flex: 1, height: 'match_parent', padding: PAD, justifyContent: 'center' }}
      >
        {model.holidayName ? (
          <TextWidget
            text={model.holidayName}
            style={{ fontSize: BODY_SIZE, color: hex(LightColors.holiday), fontWeight: 'bold' }}
            maxLines={2}
          />
        ) : null}
        <FlexWidget style={{ marginTop: model.holidayName ? HOLIDAY_GAP : 0 }}>
          {model.kuralLines.map((line) => (
            <TextWidget
              key={line}
              text={line}
              style={{ fontSize: BODY_SIZE, color: hex(LightColors.text) }}
              maxLines={1}
            />
          ))}
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
