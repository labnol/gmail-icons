InboxSDK.load('2', 'sdk_GmailSenderIcon_a798992f35').then(function (sdk) {
    var userEmailAddress = sdk.User.getEmailAddress();
    sdk.Lists.registerThreadRowViewHandler(function (threadRowView) {
        try {
            var contact = threadRowView.getContacts();
            var email = contact[0].emailAddress;
            if (email === userEmailAddress) {
                for (var c = 1; c < contact.length; c++) {
                    if (contact[c].emailAddress !== userEmailAddress) {
                        email = contact[c].emailAddress;
                        break;
                    }
                }
            }
            var domain = email.toLowerCase().split('@')[1];
            var match = domain.match(/\w+\.\w{2,3}(\.\w{2})?$/);
            if (match) {
                domain = match[0];
            }
            threadRowView.addLabel({
                backgroundColor: 'none',
                iconUrl: 'https://www.google.com/s2/favicons?domain=' + domain
            });
        } catch (f) { }
    });
});