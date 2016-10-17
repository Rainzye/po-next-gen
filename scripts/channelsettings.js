/*  Official icially forked from PS: Modified.
 *  Pokemon online channel settings plugin.
 *  Creator Xotically.
 * ***************************************
 */ Scripts plugin for (Safari) game server!

const RANKS = Config.groupsranking;
const DISABLED = 'disabled="" style="font-weight:bold;"';

const SLOWCHAT_USER_REQUIREMENT = 10;

class ChannelSettings {
	constructor(user, channel, connection) {
		this.channel = channel;
		this.user = user;
		this.connection = connection;
		this.sameCommand = true;
	}
	updateSetting(command) {
		CommandParser.parse('/' + command, this.channel, this.user, this.connection);
		this.sameCommand = false;
		this.generateDisplay();
	}
	modchat() {
		if (!this.user.can('modchat', null, this.channel)) return "<button " + DISABLED + ">" + (this.channel.modchat ? this.channel.modchat : false) + "</button>";
		let modchatOutput = [];
		for (let i = 0; i <= RANKS.length; i++) {
			if (RANKS[i] === ' ' && !this.channel.modchat) {
				modchatOutput.push('<button ' + DISABLED + '>false</button>');
			} else if (RANKS[i] === ' ') {
				modchatOutput.push('<button name="send" value="/channelsetting modchat false">false</button>');
			} else if (RANKS[i] === this.channel.modchat) {
				modchatOutput.push('<button ' + DISABLED + '>' + RANKS[i] + '</button>');
			} else if (RANKS[i]) {
				let rankIndex = RANKS.indexOf(RANKS[i]);
				let channelAuth = (this.channel.auth && this.channel.auth[this.user.userid] ? this.channel.auth[this.user.userid] : false);
				let channelAuthIndex = (channelAuth ? RANKS.indexOf(channelAuth) : false);
				if (rankIndex > 1 && !this.user.can('modchatall', null, this.channel)) continue;
				if (channelAuth && !this.user.can('bypassall')) {
					if (rankIndex > roomAtuhIndex) continue;
				}
				modchatOutput.push('<button name="send" value="/channelsetting modchat ' + RANKS[i] + '">' + RANKS[i] + '</button>');
			}
		}
		// Since autoconfirmed isn't technically a Config rank...
		modchatOutput.splice(1, 0, '<button ' + (this.room.modchat !== 'autoconfirmed' ? 'name="send" value="/channelsetting modchat autoconfirmed"' : DISABLED) + '>AC</button>');
		return modchatOutput.join(" | ");
	}
	modjoin() {
		if (!this.user.can('makeroom') && !this.channel.isPersonal) return "<button " + DISABLED + ">" + (this.channel.modjoin ? this.channel.modjoin : false) + "</button>";
		let modjoinOutput = [];
		for (let i = 0; i < RANKS.length; i++) {
			if (RANKS[i] === ' ' && !this.channel.modjoin) {
				modjoinOutput.push('<button ' + DISABLED + '>false</button>');
			} else if (RANKS[i] === ' ') {
				modjoinOutput.push('<button name="send" value="/channelsetting modjoin false">false</button>');
			} else if (RANKS[i] === this.channel.modjoin) {
				modjoinOutput.push('<button ' + DISABLED + '>' + RANKS[i] + '</button>');
			} else if (RANKS[i]) {
				// Personal channel modjoin check
				if (this.channel.isPersonal && !this.user.can('makechannel') && RANKS[i] !== '+') continue;

				modjoinOutput.push('<button name="send" value="/channelsetting modjoin ' + RANKS[i] + '">' + RANKS[i] + '</button>');
			}
		}
		return modjoinOutput.join(" | ");
	}
	stretching() {
		if (!this.user.can('editchannel', null, this.channel)) return "<button " + DISABLED + ">" + (this.channel.filterStretching ? this.channel.filterStretching : false) + "</button>";
		if (this.channel.filterStretching) {
			return '<button name="send" value="/channelsetting stretching disable">false</button> | <button ' + DISABLED + '>true</button>';
		} else {
			return '<button ' + DISABLED + '>false</button> | <button name="send" value="/channelsetting stretching enable">true</button>';
		}
	}
	capitals() {
		if (!this.user.can('editchannel', null, this.channel)) return "<button " + DISABLED + ">" + (this.channel.filterCaps ? this.channel.filterCaps : false) + "</button>";
		if (this.channel.filterCaps) {
			return '<button name="send" value="/channelsetting capitals disable">false</button> | <button ' + DISABLED + '>true</button>';
		} else {
			return '<button ' + DISABLED + '>false</button> | <button name="send" value="/channelsetting capitals enable">true</button>';
		}
	}
	slowchat() {
		if (!this.user.can('editchannel', null, this.channel) || this.channel.userCount < SLOWCHAT_USER_REQUIREMENT) return "<button " + DISABLED + ">" + (this.channel.slowchat ? this.channel.slowchat : false) + "</button>";

		let slowchatOutput = [];
		for (let i = 10; i <= 60; i += 10) {
			if (this.channel.slowchat === i) {
				slowchatOutput.push('<button ' + DISABLED + '>' + i + '</button>');
			} else {
				slowchatOutput.push('<button name="send" value="/channelsetting slowchat ' + i + '">' + i + '</button>');
			}
		}
		if (!this.channel.slowchat) {
			slowchatOutput.unshift('<button ' + DISABLED + '>false</button>');
		} else {
			slowchatOutput.unshift('<button name="send" value="/channelsettings slowchat false">false</button>');
		}
		return slowchatOutput.join(" | ");
	}
	tourStatus() {
 		if (!this.user.can('tournamentsmanagement', null, this.channel)) return "<button " + DISABLED + ">" + (this.channel.toursEnabled ? 'enabled' : 'disabled') + "</button>";
 
 		if (this.channel.toursEnabled) {
 			return '<button name="send" value="/channelsetting tournament disable">disable</button> <button ' + DISABLED + '>enabled</button>';
 		} else {
 			return '<button ' + DISABLED + '>disable</button> <button name="send" value="/channelsetting tournament enable">enable</button> ';
 		}
 	}
	generateDisplay(user, channel, connection) {
		let output = '<div class="infobox">Room Settings for ' + Tools.escapeHTML(this.channel.title) + '<br />';
		output += "<u>Modchat:</u> " + this.modchat() + "<br />";
		output += "<u>Modjoin:</u> " + this.modjoin() + "<br />";
		output += "<u>Stretching:</u> " + this.stretching() + "<br />";
		output += "<u>Capitals:</u> " + this.capitals() + "<br />";
		output += "<u>Slowchat:</u> " + this.slowchat() + "<br />";
		output += "<b>Tournaments:</b> <br />" + this.tourStatus() + "<br />";
		output += "</div>";

		this.user.sendTo(this.channel, '|uhtml' + (this.sameCommand ? '' : 'change') + '|channelsettings|' + output);
	}
}

exports.commands = {
	channelsetting: 'channelsettings',
	channelsettings: function (target, channel, user, connection) {
		if (channel.battle) return this.errorReply("This command cannot be used in battle rooms.");
		let settings = new ChannelSettings(user, channel, connection);

		if (!target) {
			channel.update();
			settings.generateDisplay(user, channel, connection);
		} else {
			settings.updateSetting(target);
		}
	},
	channelsettingshelp: ["/channelsettings - Shows current channel settings with buttons to change them (if you can)."],
};
