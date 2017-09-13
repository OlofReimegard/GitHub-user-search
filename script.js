Handlebars.templates = {};

var templates = document.querySelectorAll('template');

Array.prototype.slice.call(templates).forEach(function(tmpl) {
    Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
});

let username;
let password;
const loginBox = $("#login-box");
const searchBox = $("#search");
let userid;
let repoid;

$(document).ready(function() {
    loginBox.hide().delay(500).fadeIn("slow");
    searchBox.hide();
});

$(loginBox).on('click', '#login', function() {
    username = $("#usrnm").val();
    password = $("#pswrd").val();
    loginBox.fadeOut(500);
    searchBox.delay(500).fadeIn("slow");
});

$(searchBox).on('click', '.button', function() {
    userid = $("#userid").val();
    let user = {
        user: []
    };
    $.ajax({
        url: `https://api.github.com/users/${userid}/repos`,
        headers: {
            Authorization: 'Basic ' + btoa(username + ':' + password)
        },
        success: function(data) {
            let payload = data;
            for (let i = 0; i < payload.length; i++) {
                user.user[i] = {};
                user.user[i].name = payload[i].name;
                user.user[i].image = payload[i].owner.avatar_url;
            }
            $(Handlebars.templates.users(user)).appendTo($("#results"));
        }
    });
});

$("#results").on('click', ".repo", function(e) {
    repoid = e.target.innerText;
    var repoSelector = "." + repoid;
    repoSelector = $(repoSelector);
    let commits = {
        commits: []
    };
    $.ajax({
        url: `https://api.github.com/repos/${userid}/${repoid}/commits`,
        headers: {
            Authorization: 'Basic ' + btoa(username + ':' + password)
        },
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].commit.committer);
                commits.commits[i] = {};
                commits.commits[i].commitName = data[i].commit.committer.name;
                commits.commits[i].comment = data[i].commit.message;
            }
            $(Handlebars.templates.commits(commits)).appendTo(repoSelector);
        }

    });
});
