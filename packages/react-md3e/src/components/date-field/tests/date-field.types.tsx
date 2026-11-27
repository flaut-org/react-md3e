import { DateField } from '@flaut-travel/react-md3e/date-field';
import { DateRangeField } from '@flaut-travel/react-md3e/date-range-field';
import { DatePicker } from '@flaut-travel/react-md3e/date-picker';
import { DateRangePicker } from '@flaut-travel/react-md3e/date-range-picker';

<DateField
  value="2024-02-29"
  onChange={(value, context) => {
    value?.add({ days: 1 });
    context.validationError?.toUpperCase();
  }}
/>;
<DateField valueFormat="iso" onChange={(value) => value?.toUpperCase()} />;
<DateRangeField fieldType="multi-input" onChange={(range) => range[0]?.add({ days: 1 })} />;
<DatePicker
  variant="modal"
  onAccept={(value) => value?.add({ days: 1 })}
  slotProps={{ textField: { variant: 'filled' } }}
/>;
<DateRangePicker
  valueFormat="iso"
  calendars={3}
  onChange={(range) => range[1]?.toUpperCase()}
  onClose={(reason) => reason.toUpperCase()}
/>;
// @ts-expect-error Legacy Date is deliberately not a supported date model.
<DateField value={new Date()} />;
// @ts-expect-error Filled is a TextField variant; picker presentation is explicit.
<DatePicker variant="filled" />;
// @ts-expect-error Range inputs have exactly two endpoints.
<DateRangeField value={['2024-02-29']} />;
