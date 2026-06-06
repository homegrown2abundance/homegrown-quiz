const AC_API_URL = 'https://homegrown2abundance.api-us1.com';

const AUTOMATION_IDS = {
  capacity: 6,
  cycles: 7,
  identity: 8,
  waiting: 9,
};

const RESULT_TAGS = {
  capacity: 'quiz-weight-of-it',
  cycles: 'quiz-drift-cycle',
  identity: 'quiz-identity-gap',
  waiting: 'quiz-readiness-loop',
};

const QUIZ_LIST_ID = 6;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, result } = JSON.parse(event.body);

    if (!email || !result) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing email or result' }) };
    }

    const API_KEY = process.env.AC_API_KEY;

    // Step 1: Create or update contact
    const contactRes = await fetch(`${AC_API_URL}/api/3/contact/sync`, {
      method: 'POST',
      headers: {
        'Api-Token': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact: { email },
      }),
    });

    const contactData = await contactRes.json();
    const contactId = contactData.contact?.id;

    if (!contactId) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Could not create contact' }) };
    }

    // Step 2: Add contact to Quiz Signups list
    await fetch(`${AC_API_URL}/api/3/contactLists`, {
      method: 'POST',
      headers: {
        'Api-Token': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactList: {
          contact: contactId,
          list: QUIZ_LIST_ID,
          status: 1,
        },
      }),
    });

    // Step 3: Add result tag to contact
    const tagName = RESULT_TAGS[result];
    // First get tag ID by name
    const tagsRes = await fetch(`${AC_API_URL}/api/3/tags?search=${tagName}`, {
      headers: { 'Api-Token': API_KEY },
    });
    const tagsData = await tagsRes.json();
    const tag = tagsData.tags?.find(t => t.tag === tagName);

    if (tag) {
      await fetch(`${AC_API_URL}/api/3/contactTags`, {
        method: 'POST',
        headers: {
          'Api-Token': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactTag: {
            contact: contactId,
            tag: tag.id,
          },
        }),
      });
    }

    // Step 4: Add contact to the correct automation
    const automationId = AUTOMATION_IDS[result];

    await fetch(`${AC_API_URL}/api/3/contactAutomations`, {
      method: 'POST',
      headers: {
        'Api-Token': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactAutomation: {
          contact: contactId,
          automation: automationId,
        },
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
