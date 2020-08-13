var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");

router.route("/")
    .get(function(req, res) {
        res.render("user");
    })


router.route("/search")
    .get(function(req, res, next) {
        UserServices.searchUsers(req.query.criteria, req.query.content, req.session.u_id)
        .then(function(result) {
            var users = [];
            for (var i = 0; i < result.users.length; i++)
            {
                var books = [];
                    for (var j = 0; j < result.books.length; j++)
                    {
                        if (result.users[i].user_id == result.books[j].user_id)
                        {
                            if (result.points >= result.books[j].cost)
                            {
                                books.push({"title": result.books[j].title, "condition": result.books[j].condition_description, "olKey": result.books[j].ol_key});
                            }
                            else
                            {
                             books.push({"title": result.books[j].title, "condition": result.books[j].condition_description});   
                            }

                        }
                    }
                    if (result.users[i].private == '1')
                    {
                        users.push({"fname": result.users[i].first_name, "lname": result.users[i].last_name, "books": books});
                    }
                    else
                    {
                      users.push({"fname": result.users[i].first_name, "lname": result.users[i].last_name, "mail": result.users[i].email, "books": books});  
                    } 

            };

            res.render("search_user", {"users": users});
        })
        .catch(function(err) {
            next(err);
        })
    })

module.exports = router;
