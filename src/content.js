import * as InboxSDK from "@inboxsdk/core";

const InboxSdkKey = "sdk_SenderIcons_ad562b5c66";
const KNOWN_TLDS = new Set(["com", "org", "io", "net"]);
const OPTIONS = { ICONS: "icons", TEXT: "text" };

function getSenderEmail(threadRowView, userEmail) {
  const contacts = threadRowView.getContacts();
  return (
    contacts.find((contact) => contact.emailAddress !== userEmail)
      ?.emailAddress || contacts[0]?.emailAddress
  );
}

function getSenderDomain(email) {
  if (!email) return "";
  const parts = email.toLowerCase().split("@")[1]?.split(".") || [];
  if (parts.length < 2) return "";
  if (parts.length > 2 && KNOWN_TLDS.has(parts[parts.length - 1])) {
    return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  }
  return parts.join(".");
}

function handleThreadRowView(threadRowView, preferences, userEmail) {
  try {
    const email = getSenderEmail(threadRowView, userEmail);
    const domain = getSenderDomain(email);
    if (!domain) return;

    const options = {
      ...(preferences[OPTIONS.ICONS] && {
        iconUrl: `https://www.google.com/s2/favicons?domain=${domain}`,
      }),
      ...(preferences[OPTIONS.TEXT] && { title: domain }),
    };
    if (Object.keys(options).length > 0) {
      threadRowView.addLabel(options);
    }
  } catch (error) {
    console.error("Error processing thread row:", error, threadRowView);
  }
}

async function init() {
  try {
    const [preferences, sdk] = await Promise.all([
      chrome.storage.sync.get({ [OPTIONS.ICONS]: true, [OPTIONS.TEXT]: true }),
      InboxSDK.load(2, InboxSdkKey),
    ]);

    const userEmail = sdk.User.getEmailAddress();
    sdk.Lists.registerThreadRowViewHandler((threadRowView) =>
      handleThreadRowView(threadRowView, preferences, userEmail)
    );
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

init();
