const startingPercent = 10;
const decimal = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

type Props = {
  rate: number;
  weeks: number;
  onRate: (value: number) => void;
  onWeeks: (value: number) => void;
};

export function CompoundingExample({ rate, weeks, onRate, onWeeks }: Props) {
  const growth = 1 + rate / 100;
  const catchRate = (week: number) => Math.min(100, startingPercent * growth ** week);
  const lastPercent = catchRate(weeks);
  const fiveYearClaims = 10 * 12 * 5;
  const extraCaught = fiveYearClaims * (lastPercent - startingPercent) / 100;

  return <div className="wd-model">
    <p className="wd-caption">Try a weekly improvement</p>
    <div className="wd-model-controls">
      <label>Assumed weekly gain
        <select value={rate} onChange={event => onRate(Number(event.target.value))}>
          {[0, 1, 5, 10].map(value => <option key={value} value={value}>{value}%</option>)}
        </select>
      </label>
      <label>Time improving the rule
        <select value={weeks} onChange={event => onWeeks(Number(event.target.value))}>
          {[4, 13, 26, 52].map(value => <option key={value} value={value}>{value} weeks</option>)}
        </select>
      </label>
    </div>
    <div className="wd-model-result" aria-live="polite" aria-atomic="true">
      <strong>{whole.format(lastPercent)} <small>in 100</small></strong>
      <p>weak claims caught before you act. That’s <b>{Number((lastPercent / startingPercent).toFixed(2))}×</b> the starting rate of 10 in 100.{lastPercent === 100 && " The example has reached its ceiling."}</p>
    </div>
    <figure className="wd-chart">
      <div className="wd-bars" aria-hidden="true">
        {Array.from({ length: weeks + 1 }, (_, week) =>
          <i key={week} style={{ height: `${100 * catchRate(week) / lastPercent}%` }} />
        )}
      </div>
      <figcaption><span>Today · 10%</span><span>Week {weeks} · {decimal.format(lastPercent)}%</span></figcaption>
    </figure>
    <div className="wd-carry">
      <p className="wd-caption">If you keep that habit for five years</p>
      <p aria-live="polite" aria-atomic="true">Say you encounter ten weak claims a month. Holding this rate steady, you’d catch about <strong>{whole.format(extraCaught)} more</strong> over five years than at the starting rate.</p>
    </div>
    <details className="wd-maths">
      <summary>How the maths works</summary>
      <p>Each week adds {rate}% of the previous week’s rate. After {weeks} weeks the multiplier is {growth.toFixed(2)}<sup>{weeks}</sup> = {(growth ** weeks).toFixed(2)}×, rounded. Apply that to the starting 10% and stop at 100%. The five-year example holds the resulting rate steady across 600 weak claims.</p>
      <p>The same maths applies to time. If a rule saves five minutes on a weekly review, {rate}% weekly growth for {weeks} weeks would give about {decimal.format(5 * growth ** weeks)} minutes saved per review, provided the task takes at least that long.</p>
    </details>
  </div>;
}
