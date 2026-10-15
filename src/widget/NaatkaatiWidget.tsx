'use no memo';
// react-native-android-widget calls these components outside React. The React Compiler would add
// hidden memo hooks to them, which that library rejects as an invalid hook call.

import type { WidgetModel } from '@/calendar/widgetModel';
import type { WidgetVariant } from '@/calendar/widgetVariants';
import { DarkColors, LightColors } from '@/themes/Colors';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface WidgetLabels {
  appName: string;
  kuralTitle: string;
  eventTitle: string;
}

export interface NaatkaatiWidgetProps {
  model: WidgetModel;
  yearLabel: string;
  variant: WidgetVariant;
  labels: WidgetLabels;
  /** Current widget size in dp, when the host reports it */
  size?: { width: number; height: number };
}

const hex = (value: string): `#${string}` => `#${value.replace('#', '')}`;

const INDIGO = hex(LightColors.hero);
const ON_INDIGO = hex(LightColors.onHero);
const ON_INDIGO_MUTED = hex(LightColors.onHeroMuted);
const GREEN_ACCENT = hex(DarkColors.cultural);
const PAPER = hex(LightColors.surface);
const INK = hex(LightColors.text);
const MUTED = hex(LightColors.textMuted);
const PRIMARY = hex(LightColors.primary);
const GREEN = hex(LightColors.cultural);
const GREEN_SOFT = hex(LightColors.culturalSoft);
const MANJAL = hex(LightColors.today);
const ON_MANJAL = hex(LightColors.textOnToday);
const BORDER = hex(LightColors.border);

// Below this width the date, month and kural no longer fit side by side.
const COMPACT_WIDTH = 200;
// Below this height the extra row (event, sun times) is dropped.
const SHORT_HEIGHT = 130;
// A text with this value is replaced by a live system clock (see the react-native-android-widget patch).
const CLOCK = '@clock';
const RADIUS = 20;
const PAD = 14;
const SMALL = 11;
const BODY = 13;
const DATE = 34;
const DATE_BIG = 44;
const GAP = 6;
const DIVIDER = 1;
const TILE = 46;
const TILE_RADIUS = 12;
const DATE_COLUMN = 92;
const DOT = 6;

const root = (backgroundColor: `#${string}`, borderColor?: `#${string}`) =>
  ({
    width: 'match_parent',
    height: 'match_parent',
    backgroundColor,
    borderRadius: RADIUS,
    padding: PAD,
    ...(borderColor ? { borderColor, borderWidth: 1 } : {}),
  }) as const;

function Classic({ model, size }: NaatkaatiWidgetProps) {
  return (
    <FlexWidget clickAction="OPEN_APP" style={{ ...root(INDIGO), justifyContent: 'space-between' }}>
      <FlexWidget
        style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <TextWidget
          text={`${model.weekday} · ${model.gregorianLabel}`}
          style={{ fontSize: SMALL, color: ON_INDIGO_MUTED }}
        />
        <TextWidget
          text={CLOCK}
          style={{ fontSize: BODY + 1, color: ON_INDIGO, fontWeight: 'bold' }}
        />
      </FlexWidget>
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center' }}>
        <FlexWidget style={{ width: DATE_COLUMN, alignItems: 'center' }}>
          <TextWidget
            text={model.day}
            style={{ fontSize: DATE, color: ON_INDIGO, fontWeight: 'bold' }}
          />
          <TextWidget text={model.monthName} style={{ fontSize: SMALL, color: ON_INDIGO }} />
          <TextWidget
            text={model.year}
            style={{ fontSize: SMALL, color: ON_INDIGO_MUTED }}
            maxLines={1}
          />
        </FlexWidget>
        <FlexWidget
          style={{ width: DIVIDER, height: 'match_parent', backgroundColor: ON_INDIGO_MUTED }}
        />
        <FlexWidget style={{ flex: 1, paddingLeft: PAD }}>
          {model.kuralLines.map((line) => (
            <TextWidget
              key={line}
              text={line}
              style={{ fontSize: BODY, color: ON_INDIGO }}
              maxLines={1}
            />
          ))}
        </FlexWidget>
      </FlexWidget>
      {model.eventName && !isShort(size) ? (
        <TextWidget
          text={`● ${model.eventName}`}
          style={{ fontSize: SMALL, color: GREEN_ACCENT }}
          maxLines={1}
        />
      ) : null}
    </FlexWidget>
  );
}

function Minimal({ model, size }: NaatkaatiWidgetProps) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{ ...root(PAPER, BORDER), justifyContent: 'center', alignItems: 'center' }}
    >
      <TextWidget text={model.weekday} style={{ fontSize: SMALL, color: MUTED }} />
      <TextWidget
        text={model.day}
        style={{ fontSize: DATE_BIG, color: PRIMARY, fontWeight: 'bold' }}
      />
      {isShort(size) ? null : (
        <TextWidget text={model.monthName} style={{ fontSize: BODY, color: INK }} />
      )}
      <TextWidget text={CLOCK} style={{ fontSize: BODY + 3, color: INK, fontWeight: 'bold' }} />
    </FlexWidget>
  );
}

function Kural({ model, labels }: NaatkaatiWidgetProps) {
  return (
    <FlexWidget clickAction="OPEN_APP" style={{ ...root(GREEN), justifyContent: 'space-between' }}>
      <FlexWidget
        style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <TextWidget text={labels.kuralTitle} style={{ fontSize: SMALL, color: ON_INDIGO }} />
        <TextWidget
          text={model.kuralNumber}
          style={{ fontSize: SMALL, color: ON_INDIGO, fontWeight: 'bold' }}
        />
      </FlexWidget>
      <FlexWidget style={{ width: 'match_parent' }}>
        {model.kuralLines.map((line) => (
          <TextWidget
            key={line}
            text={line}
            style={{ fontSize: BODY + 1, color: ON_INDIGO, fontWeight: 'bold' }}
            maxLines={1}
          />
        ))}
      </FlexWidget>
      <FlexWidget
        style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <TextWidget
          text={`${model.day} · ${model.weekday}`}
          style={{ fontSize: SMALL, color: ON_INDIGO }}
          maxLines={1}
        />
        <TextWidget text={CLOCK} style={{ fontSize: BODY, color: ON_INDIGO, fontWeight: 'bold' }} />
      </FlexWidget>
    </FlexWidget>
  );
}

function Culture({ model, labels, size }: NaatkaatiWidgetProps) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{ ...root(PAPER, BORDER), justifyContent: 'space-between' }}
    >
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center' }}>
        <FlexWidget
          style={{
            width: TILE,
            height: TILE,
            borderRadius: TILE_RADIUS,
            backgroundColor: MANJAL,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextWidget
            text={model.day}
            style={{ fontSize: DATE / 1.6, color: ON_MANJAL, fontWeight: 'bold' }}
          />
        </FlexWidget>
        <FlexWidget style={{ paddingLeft: GAP + GAP }}>
          <TextWidget
            text={model.monthName}
            style={{ fontSize: BODY, color: INK, fontWeight: 'bold' }}
          />
          <TextWidget
            text={`${model.weekday} · ${model.monthYear}`}
            style={{ fontSize: SMALL, color: MUTED }}
          />
        </FlexWidget>
        <FlexWidget style={{ flex: 1, alignItems: 'flex-end' }}>
          <TextWidget text={CLOCK} style={{ fontSize: BODY + 3, color: INK, fontWeight: 'bold' }} />
        </FlexWidget>
      </FlexWidget>
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: GREEN_SOFT,
          borderRadius: TILE_RADIUS,
          padding: GAP + 2,
        }}
      >
        <FlexWidget
          style={{ width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: GREEN }}
        />
        <FlexWidget style={{ flex: 1, paddingLeft: GAP }}>
          <TextWidget text={labels.eventTitle} style={{ fontSize: SMALL - 2, color: GREEN }} />
          <TextWidget
            text={model.eventName ?? '—'}
            style={{ fontSize: SMALL + 1, color: INK, fontWeight: 'bold' }}
            maxLines={1}
          />
        </FlexWidget>
      </FlexWidget>
      {isShort(size) ? null : (
        <TextWidget
          text={`↑ ${model.sunrise}    ↓ ${model.sunset}`}
          style={{ fontSize: SMALL, color: MUTED }}
        />
      )}
    </FlexWidget>
  );
}

const isShort = (size: NaatkaatiWidgetProps['size']) =>
  size !== undefined && size.height < SHORT_HEIGHT;
const isCompact = (size: NaatkaatiWidgetProps['size']) =>
  size !== undefined && size.width < COMPACT_WIDTH;

export function NaatkaatiWidget(props: NaatkaatiWidgetProps) {
  // Resized down to about 2 columns: show the date alone, whichever layout is chosen.
  if (isCompact(props.size)) return <Minimal {...props} />;
  switch (props.variant) {
    case 'minimal':
      return <Minimal {...props} />;
    case 'kural':
      return <Kural {...props} />;
    case 'culture':
      return <Culture {...props} />;
    default:
      return <Classic {...props} />;
  }
}
