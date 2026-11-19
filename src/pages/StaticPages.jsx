import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Page from '../components/Page.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { SITE } from '../config/site.js';
import { STATIC_PAGES, staticMeta } from '../lib/seo.js';

const CONTENT = {
  about: [
    ['Why BuildCalc exists', 'Most calculators give you a number and nothing else. BuildCalc shows the formula, the assumptions and a step-by-step breakdown, so you can check the maths and adjust it for your own project.'],
    ['How the calculators work', 'Every tool uses standard geometry and unit conversions. Assumptions such as bag yield, material density and coverage per unit are visible and, where it makes sense, editable. Counts are rounded up to whole units because materials are sold that way.'],
    ['What BuildCalc is not', 'Results are planning estimates. They are not engineering, structural or professional advice. Always confirm quantities with your supplier and follow local building codes.'],
    ['Free and private', 'There are no accounts and no limits. Your inputs are processed in your browser. See the Privacy Policy for details.'],
  ],
  privacy: [
    ['Summary', 'BuildCalc does not require an account and does not send the values you type into calculators to any server. Calculations run in your browser.'],
    ['What is stored on your device', 'Preferences such as theme, measurement units, currency, favorite calculators and recently used calculators are saved in your browser’s local storage. They never leave your device and you can clear them at any time in your browser settings.'],
    ['Analytics and cookies', 'This site does not set advertising cookies. If the site owner adds an analytics or advertising service, this policy must be updated to describe it.'],
    ['Contact messages', 'The contact form opens your email app with a pre-filled message. We only receive what you send by email.'],
    ['Changes', `We may update this policy. The latest version is always on this page. Last updated ${SITE.updated}.`],
  ],
  terms: [
    ['Use of the calculators', 'BuildCalc is provided free for personal and professional planning. You are responsible for checking that the inputs and assumptions suit your project.'],
    ['Planning estimates only', 'All results are estimates. They are not engineering, structural, safety or financial advice and should not replace a qualified professional, a supplier quote or local building regulations.'],
    ['No warranty', 'The calculators are provided “as is”. We work to keep formulas correct but make no guarantee of accuracy, completeness or fitness for a particular purpose, and we are not liable for losses from relying on a result.'],
    ['Acceptable use', 'Do not misuse the site, attempt to disrupt it or scrape it in a way that harms its availability.'],
    ['Changes', `We may update these terms. Last updated ${SITE.updated}.`],
  ],
};

function Contact() {
  const [f, setF] = useState({ name: '', email: '', message: '' });
  const [err, setErr] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const n = {};
    if (!f.name.trim()) n.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) n.email = 'Enter a valid email address.';
    if (f.message.trim().length < 10) n.message = 'Write at least 10 characters.';
    setErr(n);
    if (Object.keys(n).length) return;
    const body = `${f.message}\n\n– ${f.name} (${f.email})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('BuildCalc message from ' + f.name)}&body=${encodeURIComponent(body)}`;
  };
  const field = (id, label, props = {}) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {props.area ? (
        <textarea id={id} rows={5} value={f[id]} onChange={(e) => setF({ ...f, [id]: e.target.value })} aria-invalid={!!err[id]} className={`input ${err[id] ? 'input-error' : ''}`} />
      ) : (
        <input id={id} type={props.type || 'text'} value={f[id]} onChange={(e) => setF({ ...f, [id]: e.target.value })} aria-invalid={!!err[id]} className={`input ${err[id] ? 'input-error' : ''}`} />
      )}
      {err[id] && <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{err[id]}</p>}
    </div>
  );
  return (
    <form onSubmit={submit} noValidate className="card mt-8 max-w-xl space-y-4 p-6">
      <p className="text-sm text-slate-600 dark:text-slate-400">Found a mistake or want a new calculator? Send a message. Submitting opens your email app with the message ready to send to <strong>{SITE.email}</strong>.</p>
      {field('name', 'Your name')}
      {field('email', 'Email address', { type: 'email' })}
      {field('message', 'Message', { area: true })}
      <button type="submit" className="btn btn-primary"><Mail className="h-4 w-4" aria-hidden="true" /> Open email to send</button>
    </form>
  );
}

export default function StaticPages({ page }) {
  const s = STATIC_PAGES[page];
  return (
    <Page className="container-x max-w-3xl py-8">
      <Seo meta={staticMeta(page)} />
      <Breadcrumbs items={[['Home', '/'], [s.h1]]} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.h1}</h1>
      {page === 'contact' ? (
        <Contact />
      ) : (
        <div className="mt-6 space-y-7">
          {CONTENT[page].map(([h, p]) => <section key={h}><h2 className="text-xl font-semibold">{h}</h2><p className="mt-2 leading-relaxed">{p}</p></section>)}
          {page === 'about' && <p><Link to="/calculators" className="btn btn-primary">Explore the calculators</Link></p>}
        </div>
      )}
    </Page>
  );
}
