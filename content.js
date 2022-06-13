InboxSDK.load('2', 'sdk_SenderIcons_ad562b5c66').then(function (sdk) {
	var userEmailAddress = sdk.User.getEmailAddress();
	chrome.storage.sync.get({
		icons: true,
		text: true
	}, function (items) {
		if (items.icons || items.text) {
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
					var domain = email.toLowerCase().split("@")[1];
					var match = domain.match(/\w+\.\w{2,3}(\.\w{2})?$/);
					if (match) {
						domain = match[0];
					}
					var options = {
						backgroundColor: 'none'
					};
					if (items.icons) {
						options.iconUrl = "https://www.google.com/s2/favicons?domain=" + domain;
					}
					if (items.text) {
						options.title = domain;
					}
					threadRowView.addLabel(options);
				} catch (f) {}
			});
		}
	});
});