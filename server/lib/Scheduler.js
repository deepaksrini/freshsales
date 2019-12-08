var _ = require("underscore");

function fnInactiveDeals(args) {
    console.log("Inactive deal initiated");
    $request.get(args.iparams.requester.freshSalesUrl + '/api/deals/filters', {
        headers: {
            'Authorization': 'Token token=' + args.iparams.requester.freshSalesToken,
            'Content-Type': 'application/json'
        },
        isOAuth: true
    })
        .then(function (data) {
            console.log('Successfully created task view filter' + JSON.stringify(data));
            var viewid = "";
            _.where(JSON.parse(data.response).filters, { name: 'Open Deals' }).forEach(
                datadeals => {
                    viewid = datadeals.id;
                }
            )
            $request.get(args.iparams.requester.freshSalesUrl + '/api/deals/view/' + viewid + '?include=owner', {
                headers: {
                    'Authorization': 'Token token=' + args.iparams.requester.freshSalesToken,
                    'Content-Type': 'application/json'
                },
                isOAuth: true
            })

                .then((data)=>{
                    inactivedeals(data,args);
                },

                    function () {
                        //console.error('Unable to create deals/view' + JSON.stringify(err));
                    });
        },

            function () {
                //console.error('Unable to create filter' + JSON.stringify(err));
            });
}

function fnExceededCloseddate(args) {
    console.log("Exceeded Closed date deal initiated");
    $request.get(args.iparams.requester.freshSalesUrl + '/api/deals/filters', {
        headers: {
            'Authorization': 'Token token=' + args.iparams.requester.freshSalesToken,
            'Content-Type': 'application/json'
        },
        isOAuth: true
    })

        .then((data)=>{
            ExceededCloseddatesubfn(data,args)
        });
}
function inactivedeals(data,args) {
    console.log('Successfully created view inactive' + JSON.stringify(JSON.parse(data.response)));
    var dt = new Date();
    _.each(JSON.parse(data.response).deals, function (deal) {
        var timeDiff = Math.abs(new Date(deal.updated_at).getTime() - dt.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        var innactivedays = Number(args.iparams.requester.inactiveDeals);
        if (diffDays >= innactivedays) {
            var ownerid = deal.owner_id;
            var filteredGoal = _.where(JSON.parse(data.response).users, { id: ownerid });
            var titledata = deal.name + "\n";
            var textdata = "Owner: " + filteredGoal[0].display_name + "\n";
            textdata += "Value: " + deal.amount + "\n";
            if (deal.expected_close) {
                textdata += "Expected Close date: " + deal.expected_close + " ";
            }

            var emailid = filteredGoal[0].email;
            console.log(emailid)
            $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/users.lookupByEmail', {
                headers: {
                    'Authorization': 'Bearer <%= access_token %>',
                    'Content-Type': 'application/json'
                },
                isOAuth: true,
                formData: {
                    email: emailid
                }
            })

                .then(function (data) {
                    console.log('Successfully created task' + JSON.stringify(data));

                    var channelid = JSON.parse(data.response).user.id;
                    console.log(channelid);
                    //post data
                    if (args.iparams.requester.DealInactive) {
                        $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/chat.postMessage', {
                            headers: {
                                'Authorization': 'Bearer <%= access_token %>',
                                'Content-Type': 'application/json'
                            },
                            isOAuth: true,
                            formData: {
                                channel: channelid,
                                attachments: JSON.stringify([
                                    {
                                        "pretext": "A deal you own has been inactive",
                                        "title": titledata,
                                        "text": textdata.toString(),
                                        "color": "#439FE0"
                                    }
                                ]),
                                //as_user: 'true'
                            }
                        })

                            .then(function (response) {
                                console.log('Successfully created postmessage' + JSON.stringify(response));
                            });
                    }else{
                        
                    }
                });
        }else{

        }
    });
}
function ExceededCloseddatesubfn(data,args) {
    console.log('Successfully created filter' + JSON.stringify(data));
    var viewid = "";
    _.where(JSON.parse(data.response).filters, { name: 'Open Deals' }).forEach(
        datadeals => {
            viewid = datadeals.id;
        }
    )
    $request.get(args.iparams.requester.freshSalesUrl + '/api/deals/view/' + viewid + '?include=owner', {
        headers: {
            'Authorization': 'Token token=' + args.iparams.requester.freshSalesToken,
            'Content-Type': 'application/json'
        },
        isOAuth: true
    })

        .then(function (data) {
            console.log('Successfully created deals/view' + JSON.stringify(data));
            var dt = new Date();
            _.each(JSON.parse(data.response).deals, function (deal) {
                if (!deal.expected_close) {
                    console.log("deal not exceeded");
                }
                else if ((new Date(deal.expected_close).getTime()) < dt.getTime()) {
                    console.log("exceeded date", new Date(deal.expected_close));
                    var ownerid = deal.owner_id;
                    var titledata = deal.name + "\n";
                    var filteredGoal = _.where(JSON.parse(data.response).users, { id: ownerid });
                    var textdata = "Owner: " + filteredGoal[0].display_name + "\n";
                    textdata += "Value: " + deal.amount + "\n";
                    if (deal.expected_close) {
                        textdata += "Expected Close date: " + deal.expected_close + " ";
                    }
                    var emailid = filteredGoal[0].email;
                    $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/users.lookupByEmail', {
                        headers: {
                            'Authorization': 'Bearer <%= access_token %>',
                            'Content-Type': 'application/json'
                        },
                        isOAuth: true,
                        formData: {
                            email: emailid
                        }
                    })

                        .then(function (data) {
                            console.log('Successfully created lookupByEmail' + JSON.stringify(data));

                            var channelid = JSON.parse(data.response).user.id;
                            //post data
                            if (args.iparams.requester.DealClosed) {

                                $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/chat.postMessage', {
                                    headers: {
                                        'Authorization': 'Bearer <%= access_token %>',
                                        'Content-Type': 'application/json'
                                    },
                                    isOAuth: true,
                                    formData: {
                                        channel: channelid,
                                        attachments: JSON.stringify([
                                            {
                                                "pretext": "A deal you own has crossed its expected closed date",
                                                "title": titledata,
                                                "text": textdata.toString(),
                                                "color": "#439FE0"
                                            }
                                        ]),
                                        //as_user: 'true'
                                    }
                                })

                                    .then(function (response) {
                                        console.log('Successfully created postMessage' + JSON.stringify(response));
                                    });

                            }
                        });
                }
            })
        });
}
exports = {
    InactiveDeals: fnInactiveDeals,
    ExceededCloseddate: fnExceededCloseddate
};
