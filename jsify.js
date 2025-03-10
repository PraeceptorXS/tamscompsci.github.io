var tilt = 0;

var linkify = function(text, url) {
	return "<a target='_blank' href='" + url + "'>" + text + "</a>";
};

var specialify = function(text) {
	return "<span class='special'>" + text + "</span>";
};

var data = {
	hello: "TAMS Computer Science Organization aims to " + specialify("promote Computer Science") + "\n\tin the TAMS community by providing " + specialify("mentorship") + " to those interested in\n\tfurther pursuing the field and attending " + specialify("competitions") + " ranging\n\tfrom " + specialify("major hackathons") + " to " + specialify("algorithm contests") + ".",
	help: [{
		name: specialify("help"),
		description: "Display all commands"
	}, {
		name: specialify("hello"),
		description: "Display introduction message"
	}, {
		name: specialify("leaderboard"),
		description: "See club leaderboard"
	}, {
		name: specialify("team"),
		description: "See the club executives"
	}, {
		name: specialify("competitions"),
		description: "Show upcoming algorithm competitions and hackathons"
	}, {
		name: specialify("links"),
		description: "Displays links to permission slips, resources, and more"
	}, {
		name: specialify("showcase"),
		description: "TAMS students\' cool projects"
	}, {
		name: specialify("contact"),
		description: "Contact TAMS Computer Science Organization club executives"
	}, {
		name: specialify("facebook"),
		description: "Go to the CSO Facebook group"
	}],
	contact: "Feel free to send us an email (<a href='mailto:TAMSComputerScience@gmail.com'>TAMSComputerScience@gmail.com</a>) or contact a club executive (type <span class='special'>team</span>) individually via Facebook.",
	team: [{
		name: specialify("Ben") + " Sun",
		position: "President"
	}, {
		name: specialify("Ben") + " Taylor",
		position: "Competitions Coordinator"
	}, {
		name: specialify("Connie") + " Wang",
		position: "Volunteering Coordinator"
	}, {
		name: specialify("Eric") + " Zhang",
		position: "Treasurer"
	}],
	competitions: "Competition schedule coming soon!",
	links: "Nothing here... yet!",
	showcase: [{
		name: linkify("Scheduler", "http://schedulerapp.net"),
		authors: "By Thomas Hobohm, Jeffrey Wang, Garrett Gu"
	}, {
		name: linkify("TAMS Translator", "https://chrome.google.com/webstore/detail/tams-translator/nbgijihbcldodkahfdpldfdacpecbkci"),
		authors: "By Nimit Kalra"
	}, {
		name: linkify("Fortify", "http://getfortify.com"),
		authors: "By Shashank Bhavimane, Thomas Hobohm"
	}, {
		name: linkify("Scheme", "http://getsche.me"),
		authors: "By Thomas Hobohm, Zain Khoja, Leanne Joseph, Michelle Ya"
	}, {
		name: linkify("PocketBox", "http://pocketbox.net"),
		authors: "By Thomas Hobohm"
	}, {
		name: specialify("Cool Project"),
		authors: "By <span class='special'>you</span>? Contact us if you've made a cool project you'd like featured!"
	}],
	invalid: "That's not a valid command! Type <span class='special'>help</span> for a list of commands."
};

var describify = function(obj) {
	var output = "";

	properties = [];
	for (var property in obj) {
		if (obj.hasOwnProperty(property)) {
			properties.push(obj[property]);
		}
	}

	output += properties.join(" | ");
	return output;
};

var listify = function(list) {
	var output = "";

	for (var i = 0; i < list.length; i++) {
		output += "\t• ";

		var described = describify(list[i]);
		output += described;

		output += "\n";
	}

	return output;
};

var format = function(field) {
	var unformatted = data[field];

	if (typeof unformatted == 'string') {
		return "\n\t" + unformatted + "\n\n";
	}

	return "\n" + listify(unformatted) + "\n";
};

var lambdify = function(format_string) {
	return function() { return format(format_string) }
}

var options = {
	include: ["score"],
	shouldSort: true,
	threshold: 0.3,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	keys: ['command']
};

var search = function(list, searchitem) {
	options.distance = (searchitem.length<=2? 0 : 100)
	return new Fuse(list, options).search(searchitem)
}

var loadBoard = function() {
	$.get('http://tamscso.ga/board/rest/fetch_users', function(data, status) {
		var people = JSON.parse(data);
		$('.board-container').html(
			specialify("\n\tName" + new Array(55-4).join(' ') + "Score\n\t")+
			people
				.sort(function(a, b) {
					return b.score - a.score;
				})
				.map(function(item) {
					var name = item.profile.name;
					var score = item.score;
					if(name.length > 50){
						name = name.substring(0, 47) + '...';
					}
					var spacesToAdd = 55-name.length;
					name += new Array(spacesToAdd).join(' ');
					return name + score;
				})
				.join('\n\t')+
			"\n\n\t"+linkify('Click here', 'http://tamscso.ga/board')+" to see the full leaderboard."
		);
	})
}

$(function() {
	var intro = "Welcome to the Computer Science Organization (CSO) at TAMS!\nType 'hello' below to learn what we're all about! Try '?' for more.\n\n";
	var jqconsole = $('#console').jqconsole(intro, 'cso> ');
	var cout = function(input){
		jqconsole.Write("     "+input.replace(/\n/g,'\n     ')+'\n', 'jqconsole-output', false);
	}
	function process(input) {
		var parsed = input.split(" ");
		var commands = [
			[["help", "?", "ls"], lambdify('help')],
			[["hello", "mission", "description", "why"], lambdify('hello')],
			[["team", "execs", "executives", "officers"], lambdify('team')],
			[["competitions", "hackathons", "events"], lambdify('competitions')],
			[["links", "forms", "info"], lambdify('links')],
			[["projects", "showcase"], lambdify('showcase')],
			[["contact"], lambdify('contact')],
			[["clear", "cls"], function() { jqconsole.Clear(); return '\r'; }],
			[["fb", "facebook"], function() {
				window.location.href = "https://www.facebook.com/groups/CSO2020/";
				return '\r';
			}],
			[["tilt"], function() {
				tilt += 7;
				$(document.documentElement).addClass('rotate_please');
				document.documentElement.setAttribute('style', 'transform: rotate(' + String(tilt) + 'deg);');
				return "\n\n";
			}],
			[["qt"], function() {
				tilt += 70;
				$(document.documentElement).addClass('qt_please');
				document.documentElement.setAttribute('style', 'transform: rotate(' + String(tilt) + 'deg);');
				return "\n\n";
			}],
			[["untilt"], function() {
				tilt = 0;
				$(document.documentElement).removeClass('rotate_please');
				$(document.documentElement).removeClass('qt_please');
				document.documentElement.setAttribute('style', 'transform: rotate(' + String(tilt) + 'deg);');
				return "\n\n";
			}],
			[["js", "javascript", "code"], function() {}], //since this is processed directly, there is no need for a function here
			[["leaderboard"], function() {
				jqconsole.Append($('<div class="board-container">Loading...</div>'));
				loadBoard();
				return '\n';
			}]
		];
		var response = null;
		commands.forEach(function(key, index, commands) {
			key[0].forEach(function(term, tindex) {
				if (term === parsed[0]) {
					response = key[1]();
				}
			});
		});
		if (response) {
			return response;
		} else {
			var commands_list = [];
			commands.forEach(function(key, index, commands) {
				key[0].forEach(function(term, tindex) {
					if (term !== "qt") {
						commands_list.push({
							'command': term,
							'callback': key[1]
						});
					}
				})
			});
			var results = search(commands_list, parsed[0]);
			if (results.length > 0) {
				response = '\nThat command doesn\'t exist. Did you mean ';
				results.forEach(function(result, index) {
					if (index === results.length - 1 && results.length == 2) {
						response = response.substring(0, response.length - 2);
						response += ' or ' + specialify(result['item']['command']) + ', ';
					} else if (index === results.length - 1 && results.length > 1) {
						response = response.substring(0, response.length - 2);
						response += ', or ' + specialify(result['item']['command']) + ', ';
					} else {
						response += specialify(result['item']['command']) + ', ';
					}
				});
				response = response.substring(0, response.length - 2);
				response += '?\n\n';
				return response;
			} else {
				return '\nThat command doesn\'t exist. Here is a list of commands you can use:\n' + format('help');
			}
		}
	};
	var jsmode = false;
	var blockQuery = false;
	var block = "";
	var processJs = function(input){
		if(input.match(/exit/) || input.match(/process.exit\(/)){
			jsmode = false;
			jqconsole.SetPromptLabel("cso> ");
			jqconsole.Write('\n');
			startPrompt();
			return;
		}
		if(!blockQuery){
			block = "";
		}
		block+=input;
		var leftParens = (block.match(/\{/g)? block.match(/\{/g).length: 0);
		var rightParens = (block.match(/\}/g)? block.match(/\}/g).length: 0);
		if(leftParens > rightParens){
			blockQuery = true;
			startPrompt();
			return;
		}else{
			blockQuery = false;
		}
		var result;
		try{
			result = eval('eval')(block); //indirect call so it's global
		}catch(err){
			result = err;
		}
		result = String(result);
		cout(result);
	}
	var processQuery = function(input) {
		if(jsmode){
			processJs(input);
			startPrompt();
			return;
		}
		if (input) {
			if(input == "javascript" || input == "js" || input == "code" || input == "node"){
				jsmode = true;
				jqconsole.SetPromptLabel("   > ");
				jqconsole.Write('\n');
				startPrompt();
				return;
			}
			jqconsole.Write(process(input),'jqconsole-output',false);
		} else {
			jqconsole.Write('\n Here is a list of commands:\n' + format('help'), 'jqconsole-output', false);
		}
		startPrompt();
	}
	var startPrompt = function() {
		jqconsole.Prompt(true, processQuery);
	};

	startPrompt();
});
