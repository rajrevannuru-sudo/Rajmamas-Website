// Shared submit for every website form: saves the lead to the CMS (Leads) and emails it through Web3Forms.
// Counts as sent if either succeeds, so an email hiccup never loses a lead (and vice versa).
export type Enquiry = {
  form: 'contact' | 'blog' | string;
  name: string;
  email: string;
  message: string;
  company?: string;
  services?: string;
};

export async function sendEnquiry(formEl: HTMLFormElement, enquiry: Enquiry): Promise<boolean> {
  const botcheck = formEl.querySelector<HTMLInputElement>('input[name="botcheck"]')?.checked ?? false;
  const saveLead = fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...enquiry, page: location.pathname, botcheck }),
  }).then(async (r) => r.ok && (await r.json()).ok === true);

  const key = formEl.querySelector<HTMLInputElement>('input[name="access_key"]')?.value;
  const sendEmail = key
    ? fetch(formEl.action, { method: 'POST', headers: { Accept: 'application/json' }, body: emailData(formEl, enquiry) }).then(
        async (r) => r.ok && (await r.json()).success === true,
      )
    : Promise.resolve(false);

  const results = await Promise.allSettled([saveLead, sendEmail]);
  return results.some((r) => r.status === 'fulfilled' && r.value === true);
}

function emailData(formEl: HTMLFormElement, enquiry: Enquiry): FormData {
  const data = new FormData(formEl);
  data.delete('services');
  if (enquiry.services) data.set('service', enquiry.services);
  return data;
}
