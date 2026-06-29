const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).map((line) => {
    const cells = [];
    let cell = ''; let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];
      if (character === '"') quoted = !quoted;
      else if (character === ',' && !quoted) { cells.push(cell); cell = ''; }
      else cell += character;
    }
    cells.push(cell);
    return cells.map((value) => value.trim());
  });
  const [headers, ...data] = rows;
  return data.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ''])));
}

/* Inline SVG paths extracted from https://pnp.github.io/images/base-assets.svg
   Embedded locally so no cross-origin requests are made at runtime. */
const SESSION_ICONS = {
  teams: {
    svg: '<svg class="icon-svg" viewBox="0 0 48 48" aria-hidden="true"><path d="M31.993 19H43.1a1.9 1.9 0 0 1 1.9 1.9v10.117A6.983 6.983 0 0 1 38.017 38h-.033A6.983 6.983 0 0 1 31 31.017V19.993a.993.993 0 0 1 .993-.993z" fill="#5059c9"/><circle cx="39.5" cy="12.5" r="4.5" fill="#5059c9"/><circle cx="25.5" cy="10.5" r="6.5" fill="#7b83eb"/><path d="M34.167 19H15.833A1.88 1.88 0 0 0 14 20.923v11.539A11.279 11.279 0 0 0 25 44a11.279 11.279 0 0 0 11-11.538V20.923A1.88 1.88 0 0 0 34.167 19z" fill="#7b83eb"/><path d="M26 19v16.17a1.841 1.841 0 0 1-1.14 1.69 1.772 1.772 0 0 1-.69.14h-9.29c-.13-.33-.25-.66-.35-1a12.179 12.179 0 0 1-.53-3.54V20.92A1.877 1.877 0 0 1 15.83 19z" opacity=".1"/><path d="M25 19v17.17a1.772 1.772 0 0 1-.14.69A1.841 1.841 0 0 1 23.17 38h-7.82c-.17-.33-.33-.66-.47-1s-.25-.66-.35-1a12.179 12.179 0 0 1-.53-3.54V20.92A1.877 1.877 0 0 1 15.83 19z" opacity=".2"/><path d="M25 19v15.17A1.844 1.844 0 0 1 23.17 36h-8.64a12.179 12.179 0 0 1-.53-3.54V20.92A1.877 1.877 0 0 1 15.83 19z" opacity=".2"/><path d="M24 19v15.17A1.844 1.844 0 0 1 22.17 36h-7.64a12.179 12.179 0 0 1-.53-3.54V20.92A1.877 1.877 0 0 1 15.83 19z" opacity=".2"/><path d="M26 13.83v3.15c-.17.01-.33.02-.5.02s-.33-.01-.5-.02a5.489 5.489 0 0 1-1-.16A6.5 6.5 0 0 1 19.5 13a5.556 5.556 0 0 1-.32-1h4.99A1.837 1.837 0 0 1 26 13.83z" opacity=".1"/><path d="M25 14.83v2.15a5.489 5.489 0 0 1-1-.16A6.5 6.5 0 0 1 19.5 13h3.67A1.837 1.837 0 0 1 25 14.83z" opacity=".2"/><path d="M24 14.83v1.99A6.5 6.5 0 0 1 19.5 13h2.67A1.837 1.837 0 0 1 24 14.83z" opacity=".2"/><rect x="2" y="13" width="22" height="22" rx="1.833" fill="#5a62c3"/><path d="M17.824 19.978h-3.665v9.98h-2.335v-9.98H8.176v-1.936h9.648z" fill="#fff"/></svg>',
    label: 'Join on Teams'
  },
  calendar: {
    /* fill applied via imported CSS: .icon-calendar-ltr-filled { fill: var(--dark-blue) } */
    svg: '<svg class="icon-svg icon-calendar-ltr-filled" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 8.167A4.167 4.167 0 0 1 8.167 4h15.667a4.167 4.167 0 0 1 4.167 4.167v1.167h-24V8.167zM4 11v12.833A4.167 4.167 0 0 0 8.167 28h15.667a4.167 4.167 0 0 0 4.167-4.167V11h-24zm8 4.667a1.667 1.667 0 0 1-3.334 0 1.667 1.667 0 0 1 3.334 0zm4 1.666a1.667 1.667 0 0 1 0-3.334 1.667 1.667 0 0 1 0 3.334zm7.333-1.666a1.667 1.667 0 0 1-3.334 0 1.667 1.667 0 0 1 3.334 0zm-13 7a1.667 1.667 0 0 1 0-3.334 1.667 1.667 0 0 1 0 3.334zM17.667 21a1.667 1.667 0 0 1-3.334 0 1.667 1.667 0 0 1 3.334 0z"/></svg>',
    label: 'Add to calendar'
  },
  meetup: {
    svg: '<svg class="icon-svg" viewBox="0 0 32 32" aria-hidden="true"><g transform="scale(1.5) translate(-2,-2)"><path d="m 18.004214,21.579619 c -0.166636,-0.229757 -0.232281,-0.517583 -0.184309,-0.797835 0.04797,-0.277729 0.207033,-0.527684 0.44184,-0.689269 0.232281,-0.159059 0.522633,-0.219657 0.800361,-0.166631 0.277728,0.05303 0.522634,0.217132 0.679171,0.454462 0.156538,0.229758 0.212084,0.512535 0.161589,0.785214 -0.05302,0.272676 -0.209559,0.51506 -0.439315,0.671597 -0.227232,0.156528 -0.507485,0.219655 -0.782688,0.171692 -0.27268,-0.04796 -0.515061,-0.201977 -0.676649,-0.429224 z m -6.06457,1.282601 c -0.09847,-0.141383 -0.136339,-0.318126 -0.103517,-0.487288 0.0303,-0.169161 0.126238,-0.320649 0.270154,-0.419117 0.141388,-0.09848 0.315599,-0.136341 0.487286,-0.106032 0.169163,0.03282 0.32065,0.128769 0.419117,0.272677 0.09847,0.141383 0.136338,0.315601 0.103516,0.487287 -0.0303,0.169162 -0.128765,0.32065 -0.270154,0.419117 -0.141389,0.09848 -0.318125,0.136342 -0.487286,0.103522 -0.169164,-0.03029 -0.32065,-0.128769 -0.419117,-0.270152 z M 19.503946,5.4385744 c 0.143912,0.2095595 0.272678,0.431741 0.37872,0.6640224 0.108565,0.2322816 0.194411,0.4721377 0.262579,0.7170435 0.06564,0.2474304 0.111092,0.4999105 0.133815,0.7523904 0.02525,0.2550051 0.02525,0.5100098 0.0051,0.7650146 0.520109,0.1540127 0.994771,0.4670878 1.33057,0.9417502 0.752387,1.0679905 0.540304,2.5121765 -0.439318,3.3377865 1.222003,1.944095 0.709469,4.519392 -1.19928,5.837338 -0.795313,0.550406 -1.70929,0.777638 -2.605594,0.744816 -0.169161,0.669072 -0.560506,1.282597 -1.174033,1.706763 -1.146259,0.790264 -2.64094,0.643825 -3.635712,-0.244906 -0.02777,0.02272 -0.05302,0.04545 -0.07827,0.06817 q -0.01261,0.01255 -0.02777,0.02525 -0.01261,0.01016 -0.02525,0.02272 -0.01261,0.01016 -0.02777,0.02272 -0.01261,0.01016 -0.02777,0.02021 C 10.588888,22.054285 8.1373063,21.604869 6.9026788,19.819839 Q 6.741092,19.585032 6.6148518,19.330028 6.4886119,19.075023 6.4027683,18.804869 6.3144003,18.532191 6.2664292,18.251938 6.2184577,17.971685 6.2134085,17.686383 C 5.228725,17.524793 4.3096978,16.979436 3.7264687,16.075558 2.7417967,14.550578 3.039723,12.57366 4.3349456,11.387004 3.3805711,9.8519254 3.7794896,7.824511 5.2842706,6.7868178 5.7387347,6.4712179 6.2436947,6.2995313 6.7562295,6.2313619 6.847122,5.9915058 6.9556883,5.759224 7.0819285,5.5370417 7.2081682,5.3123342 7.3495572,5.1002513 7.5086194,4.8982671 7.6651573,4.6988081 7.8393687,4.5094479 8.0262035,4.3327119 8.2130389,4.1585007 8.4124983,3.9969134 8.6220568,3.8529998 10.364169,2.64867 12.585993,2.6941164 14.26246,3.7671567 16.143437,3.0879853 18.314765,3.7191854 19.503946,5.4385744 Z M 2.5473871,10.273567 c 0.2221824,0.151488 0.3736704,0.386294 0.4216415,0.648874 0.047971,0.262579 -0.00757,0.532733 -0.1590622,0.754915 C 2.6584785,11.897014 2.4261966,12.048501 2.1636175,12.096473 1.8985134,12.146963 1.6283598,12.088873 1.4087022,11.93741 1.1865197,11.785922 1.0350318,11.553641 0.9870605,11.291061 0.9390875,11.028482 0.9971635,10.755803 1.1461221,10.536146 1.2976092,10.316488 1.5298917,10.165 1.7949958,10.114504 c 0.2625793,-0.04797 0.5327329,0.01008 0.7523913,0.159063 z M 6.4532534,4.1080046 C 6.5668699,4.2746411 6.6123156,4.4816751 6.5744442,4.6811343 6.5391,4.8805929 6.4254814,5.0573297 6.2563196,5.1734705 6.0896835,5.2896111 5.8851739,5.3325321 5.6831897,5.2971856 5.4837299,5.2593133 5.3069937,5.1456977 5.1933777,4.9790608 5.0772371,4.8124239 5.0317905,4.6053903 5.0696626,4.4059311 5.1050099,4.2064719 5.2186257,4.0297359 5.3877874,3.9135951 5.5544243,3.7999791 5.7589331,3.7545325 5.9583921,3.7898798 6.1603771,3.8277527 6.3371123,3.9413667 6.4532534,4.1080046 Z M 7.9024886,0.06579846 c 0.1413888,-0.03282235 0.2878272,-0.0075743 0.4090173,0.07069442 0.1237155,0.0757439 0.2095595,0.19945926 0.2398563,0.33832326 0.030295,0.14138884 0.00253,0.2878272 -0.078268,0.40901764 C 8.3948268,1.0050241 8.2711095,1.0883426 8.1297218,1.1161153 7.9908578,1.1413634 7.8494689,1.1135906 7.7308032,1.0378466 7.614662,0.95957791 7.5313445,0.83838737 7.5010463,0.70204821 7.4732739,0.5657089 7.4985156,0.42179539 7.5717418,0.30312977 7.6474847,0.18446421 7.7661507,0.09862094 7.9024886,0.06579846 Z m 6.0999174,0.77763848 c 0.227232,-0.12876488 0.494861,-0.16411207 0.747341,-0.0959425 0.25248,0.0656448 0.467088,0.2297568 0.600902,0.45193926 0.13634,0.2247072 0.176737,0.4898113 0.116141,0.7448163 -0.05807,0.2524803 -0.214608,0.474663 -0.434266,0.6135271 -0.227232,0.1363393 -0.49991,0.1767363 -0.75744,0.1136162 C 14.017555,2.6057484 13.795372,2.4441611 13.659033,2.2144038 13.522694,1.9871716 13.482297,1.7170179 13.547942,1.4594881 13.611062,1.2019586 13.775174,0.97977615 14.002406,0.84343694 Z M 5.1706546,19.287104 c -0.1211907,0.02777 -0.2474305,0.0025 -0.3509474,-0.06312 -0.1060417,-0.06817 -0.1792613,-0.174211 -0.204509,-0.295402 -0.027772,-0.121191 -0.00504,-0.24743 0.063121,-0.353472 0.068169,-0.103517 0.1742108,-0.176736 0.2954017,-0.204509 0.1211912,-0.02525 0.2474305,-0.0025 0.353472,0.06564 0.1035174,0.06564 0.1767376,0.171686 0.2019848,0.295401 0.027772,0.121191 0.00504,0.247431 -0.063121,0.350947 -0.068169,0.106043 -0.1742108,0.179261 -0.2954017,0.204512 z M 22.657421,6.5393872 C 22.796285,6.723699 22.854355,6.9585044 22.816483,7.1857359 22.7786,7.4154929 22.649847,7.6200018 22.460487,7.7512912 22.268603,7.882581 22.033796,7.9305516 21.806564,7.8851058 21.579332,7.8371332 21.379872,7.7007939 21.256157,7.5063858 21.137493,7.3195492 21.09457,7.0948431 21.140016,6.8802351 c 0.04292,-0.2171342 0.169163,-0.4090176 0.350947,-0.532733 0.181785,-0.1262383 0.403968,-0.1767356 0.621101,-0.1388641 0.219658,0.035345 0.414067,0.1540126 0.545357,0.3307492 z m 0.679172,5.6833258 c 0.16412,-0.02777 0.328224,0.0076 0.464561,0.09847 0.136342,0.09089 0.232283,0.232281 0.267631,0.393869 0.03535,0.159062 0.005,0.328224 -0.08078,0.467087 -0.08583,0.138865 -0.222182,0.239856 -0.381244,0.280253 -0.164119,0.03282 -0.333275,0 -0.472139,-0.09089 -0.138876,-0.09089 -0.237337,-0.234806 -0.272683,-0.396393 -0.03535,-0.164112 -0.0051,-0.333274 0.08332,-0.474663 0.0909,-0.138864 0.229757,-0.239856 0.391344,-0.277728 z m 1.269973,-2.9312935 c 0.123728,-0.030295 0.252481,-0.00757 0.361048,0.060594 0.106032,0.068169 0.181775,0.1742108 0.209549,0.2979263 0.02525,0.1262402 0.0024,0.2550048 -0.06817,0.3610472 -0.0707,0.106042 -0.179265,0.17926 -0.302974,0.201983 -0.121177,0.02272 -0.247433,0 -0.350949,-0.06817 -0.10099,-0.06817 -0.174222,-0.1742113 -0.199462,-0.295402 -0.02778,-0.1211907 -0.005,-0.2449058 0.0606,-0.3509471 0.06564,-0.1035174 0.169162,-0.1767376 0.29035,-0.2070332 z" fill="red"/><path d="m 17.032166,15.368614 c 0.449415,0.06312 0.896304,0.12624 0.966999,0.578179 0.189359,1.206855 -2.15113,0.75744 -2.686388,0.497386 -0.840758,-0.411543 -1.350768,-1.350769 -1.13111,-2.279895 0.08332,-0.358521 0.537782,-1.287648 0.964474,-2.163754 0.401443,-0.818035 0.777638,-1.588099 0.807935,-1.800182 0.05807,-0.4443649 -0.17926,-0.482237 -0.328223,-0.4898113 -0.18936,-0.010097 -0.340849,0.083318 -0.527684,0.3660963 -0.118665,0.179261 -1.070515,2.065286 -1.706765,3.325161 -0.285302,0.570605 -0.510009,1.012445 -0.56303,1.110912 -0.297927,0.565555 -0.674122,0.69937 -1.052842,0.681697 -0.552931,-0.0303 -0.805411,-0.325699 -0.724618,-0.858432 0.0202,-0.141389 0.290353,-0.800362 0.580705,-1.512356 0.343373,-0.843283 0.717043,-1.759785 0.75239,-1.994592 0.03787,-0.265104 -0.01515,-0.547882 -0.277728,-0.684221 -0.265104,-0.136339 -0.57818,0.07322 -0.671597,0.229757 -0.0606,0.103517 -0.487286,1.184131 -0.934176,2.322816 -0.494861,1.257351 -1.0174943,2.582871 -1.1134369,2.759607 -0.3206496,0.580704 -0.656448,0.765015 -1.1614084,0.790262 -1.1967548,0.05555 -2.0854849,-0.929126 -1.6941405,-2.133456 0.03282,-0.100992 0.098467,-0.323174 0.1893601,-0.623625 0.3938684,-1.320471 1.247251,-4.1810697 1.7219134,-5.0243533 0.391344,-0.6968449 1.4820575,-1.2270524 2.2369733,-0.9013533 0.24743,0.1085669 0.557981,0.2575296 0.790262,0.3686207 0.133815,0.065644 0.244906,0.1161412 0.302976,0.1439136 0.323175,0.1413889 0.666548,-0.1792603 0.853383,-0.3534723 0.02525,-0.025248 0.04797,-0.045448 0.06817,-0.063121 q 0.02777,-0.022723 0.05302,-0.047972 c 0.138864,-0.118666 0.275204,-0.2398563 0.44184,-0.3105505 0.18936,-0.083317 0.489811,-0.1161412 0.719568,-0.083317 0.229757,0.035345 0.368621,0.1211907 0.454465,0.1918842 0.141388,0.1136164 0.239856,0.2045091 0.361046,0.3231743 l 0.07574,0.070695 c 0.222182,0.2120835 0.386294,0.1110897 0.50496,0.040398 l 0.0303,-0.020198 0.0076,-0.00253 c 0.20704,-0.1211902 0.373677,-0.2171332 0.987204,-0.2070324 0.638774,0.012621 1.373491,0.2398561 1.524979,1.3280451 0.08332,0.5882784 -0.381245,1.6259709 -0.866007,2.7040609 -0.510009,1.138685 -1.042742,2.325341 -0.964473,3.067632 0.05555,0.522634 0.532733,0.588279 1.007395,0.653923 z" fill="white"/></g></svg>',
    label: 'View on Meetup'
  }
};

function iconBar(session) {
  const slots = [
    { key: 'teams',    url: session.teams_url },
    { key: 'calendar', url: session.calendar_url },
    { key: 'meetup',   url: session.meetup_url }
  ];
  const items = slots
    .filter(({ url }) => !!url)
    .map(({ key, url }) => {
      const { svg, label } = SESSION_ICONS[key];
      return `<li class="card-iconbar-item"><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="card-iconbar-link" aria-label="${label}"><span class="icon">${svg}</span></a></li>`;
    });
  return items.length ? `<menu class="card-iconbar">${items.join('')}</menu>` : '';
}

function sessionActions(session) {
  const actions = [];
  if (session.registration_url) actions.push(`<a class="button primary" href="${escapeHtml(session.registration_url)}">Register <span aria-hidden="true">→</span></a>`);
  if (session.recording_url) actions.push(`<a class="button quiet" href="${escapeHtml(session.recording_url)}">Watch recording</a>`);
  return actions.join('');
}

// ── Live session status ──

function zonedToUtc(dateStr, timeStr, timezone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  // Initial guess: treat as UTC-8 (PST worst case)
  let utcMs = Date.UTC(year, month - 1, day, hour + 8, minute);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: false })
      .formatToParts(new Date(utcMs)).map((p) => [p.type, p.value])
  );
  // Correct for actual offset (handles PDT vs PST automatically)
  return utcMs + ((hour - parseInt(parts.hour)) * 60 + (minute - parseInt(parts.minute))) * 60000;
}

function addDaysToDateStr(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function findNextOccurrence(anchor, intervalWeeks, startTimeStr, durationMinutes, nowMs) {
  const anchorMs = zonedToUtc(anchor, startTimeStr, 'America/Los_Angeles');
  const rawN = Math.max(0, Math.floor((nowMs - anchorMs) / (intervalWeeks * 7 * 24 * 60 * 60 * 1000)));
  for (const n of [rawN - 1, rawN, rawN + 1, rawN + 2]) {
    if (n < 0) continue;
    const startMs = zonedToUtc(addDaysToDateStr(anchor, n * intervalWeeks * 7), startTimeStr, 'America/Los_Angeles');
    const endMs = startMs + durationMinutes * 60000;
    if (nowMs <= endMs) return { startMs, endMs };
  }
  return null;
}

function computeLiveState(session, nowMs) {
  const { recurrence_anchor: anchor, recurrence_weeks: weeks, start_time: startTime, duration_minutes: durStr, countdown_minutes: cdStr } = session;
  if (!anchor || !weeks || !startTime) return null;
  const occ = findNextOccurrence(anchor, parseInt(weeks), startTime, parseInt(durStr) || 60, nowMs);
  if (!occ) return null;
  const msUntilStart = occ.startMs - nowMs;
  if (nowMs >= occ.startMs) return { type: 'live' };
  if (msUntilStart <= (parseInt(cdStr) || 60) * 60000) return { type: 'countdown', msUntilStart, startMs: occ.startMs };
  return { type: 'next', startMs: occ.startMs };
}

function formatCountdown(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatNextDate(startMs) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', weekday: 'short', month: 'short', day: 'numeric'
  }).format(new Date(startMs));
}

function liveDataAttrs(session) {
  const { recurrence_anchor, recurrence_weeks, start_time, duration_minutes, countdown_minutes, status_label } = session;
  if (!recurrence_anchor || !recurrence_weeks || !start_time) return '';
  return ` data-live-anchor="${escapeHtml(recurrence_anchor)}" data-live-weeks="${escapeHtml(recurrence_weeks)}" data-live-start="${escapeHtml(start_time)}" data-live-duration="${escapeHtml(duration_minutes || '60')}" data-live-countdown="${escapeHtml(countdown_minutes || '60')}" data-live-label="${escapeHtml(status_label || '')}"`;
}

function initLiveStatus() {
  const cards = [...document.querySelectorAll('[data-live-anchor]')];
  if (!cards.length) return;

  const preview = new URLSearchParams(location.search).get('preview');

  // Snapshot fake time offset once so countdown ticks in real time during preview
  let fakeNowOffset = 0;
  if (preview) {
    const card = cards[0];
    const { liveAnchor, liveWeeks, liveStart, liveDuration, liveCountdown } = card.dataset;
    const occ = findNextOccurrence(liveAnchor, parseInt(liveWeeks), liveStart, parseInt(liveDuration) || 60, Date.now());
    if (occ) {
      let fakeNow;
      if (preview === 'live') fakeNow = occ.startMs + 15 * 60000;
      else if (preview === 'countdown') fakeNow = occ.startMs - Math.floor((parseInt(liveCountdown) || 60) * 0.75) * 60000;
      else fakeNow = occ.startMs - 3 * 24 * 60 * 60 * 1000;
      fakeNowOffset = fakeNow - Date.now();
    }
  }

  function applyState(card, state) {
    const el = card.querySelector('.session-status');
    if (!el) return;
    card.classList.remove('live');
    el.className = 'session-status';
    if (!state) { el.textContent = ''; return; }
    const label = card.dataset.liveLabel || '';
    if (state.type === 'live') {
      card.classList.add('live');
      el.classList.add('session-status--live');
      el.textContent = 'Live now';
    } else if (state.type === 'countdown') {
      el.classList.add('session-status--countdown');
      const prefix = label ? `Next ${label} · ` : '';
      const icon = `<span class="status-cal-icon" aria-hidden="true">${SESSION_ICONS.calendar.svg}</span>`;
      el.innerHTML = `${icon}${escapeHtml(`${prefix}Starts in ${formatCountdown(state.msUntilStart)}`)}`;

    } else {
      el.classList.add('session-status--next');
      const prefix = label ? `Next ${label}: ` : 'Next: ';
      const icon = `<span class="status-cal-icon" aria-hidden="true">${SESSION_ICONS.calendar.svg}</span>`;
      el.innerHTML = `${icon}${escapeHtml(`${prefix}${formatNextDate(state.startMs)}`)}`;
    }
  }

  function updateAll() {
    const nowMs = Date.now() + fakeNowOffset;
    cards.forEach((card) => {
      const session = {
        recurrence_anchor: card.dataset.liveAnchor,
        recurrence_weeks: card.dataset.liveWeeks,
        start_time: card.dataset.liveStart,
        duration_minutes: card.dataset.liveDuration,
        countdown_minutes: card.dataset.liveCountdown
      };
      applyState(card, computeLiveState(session, nowMs));
    });
  }

  updateAll();
  setInterval(updateAll, 1000);
}

async function renderSessions() {
  const host = document.querySelector('[data-sessions]');
  if (!host) return;
  try {
    const response = await fetch('data/sessions.csv');
    const sessions = parseCsv(await response.text()).filter((session) => session.enabled.toLowerCase() === 'true');
    if (sessions.length === 1) host.classList.add('event-grid--single');
    else if (sessions.length === 2) host.classList.add('event-grid--two');

    host.innerHTML = sessions.map((session) => `<article class="event-card ${session.featured === 'true' ? 'featured' : ''}"${liveDataAttrs(session)}>
      <div class="event-card__marker">${iconBar(session)}</div>
      <div class="event-card__content">
        <p class="eyebrow">${escapeHtml(session.category)}</p>
        <h3>${escapeHtml(session.title)}</h3>
        <p>${escapeHtml(session.summary)}</p>
        <p class="event-card__schedule">${escapeHtml(session.schedule)}</p>
        <p class="session-status" aria-live="polite" aria-atomic="true"></p>
        <div class="button-row">${sessionActions(session)}</div>
      </div>
    </article>`).join('') || '<p>No sessions are currently scheduled. Please check back soon.</p>';

    initLiveStatus();
  } catch {
    host.innerHTML = '<p>Session information is temporarily unavailable. Please check back soon.</p>';
  }
}

function badgeDisplayName(name) {
  return name.replace(/\s*-\s*Microsoft 365 & Power Platform Community.*$/i, '').trim();
}

function badgeCard(badge) {
  const label = badgeDisplayName(badge.name);
  const visual = badge.image
    ? `<img class="badge-card__image" src="${escapeHtml(badge.image)}" alt="${escapeHtml(badge.name)}" loading="lazy">`
    : `<div class="badge-card__monogram" aria-hidden="true">${escapeHtml(label).split(' ').slice(0, 2).map((word) => word[0]).join('')}</div>`;
  return `<article class="badge-card">
    ${visual}
    <div><h3>${escapeHtml(label)}</h3>
    <a class="text-link" href="${escapeHtml(badge.url)}" target="_blank" rel="noopener noreferrer">View on Credly <span aria-hidden="true">→</span></a></div>
  </article>`;
}

async function renderBadges() {
  const gallery = document.querySelector('[data-badge-gallery]');
  const feature = document.querySelector('[data-featured-badge]');
  if (!gallery) return;
  try {
    const response = await fetch('../data/badges.json');
    const data = await response.json();
    const featured = data.badges.find((badge) => badge.featured) || data.badges[0];
    if (feature && featured) feature.innerHTML = badgeCard(featured);
    gallery.innerHTML = data.badges.filter((badge) => badge !== featured).map(badgeCard).join('');
  } catch {
    gallery.innerHTML = '<p>Badge information is temporarily unavailable. Visit our Credly catalog for the current list.</p>';
  }
}

renderSessions();
renderBadges();

// Hamburger menu
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-header nav');
  if (!toggle || !nav) return;
  function close() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('click', (e) => { if (!e.target.closest('.site-header')) close(); });
}());
