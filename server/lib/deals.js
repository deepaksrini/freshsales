function fnCreateDealPostSlack(args) {
    var amount = args.data.deal.amount.value;
    var emailid = args.data.associations.owner.email;

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
            var titledata = args.data.deal.name.value + "\n";
            var textdata = "Owner: " + args.data.associations.owner.name + "\n";
            if(args.data.associations.sales_account){
                textdata += "Account: " + args.data.associations.sales_account.name + "\n";
            }
            textdata += "Value: " + amount + "\n";
            if (args.data.deal.expected_close.value) {
                textdata += "Expected Close date: " + args.data.deal.expected_close.value + " ";
            }
            if (args.iparams.requester.DealCreated) {
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
                                "pretext": "A new deal has been assigned to you!",
                                "title": titledata,
                                "text": textdata.toString(),
                                "color": "#439FE0"
                            }
                        ]),
                    }
                })

                    .then(function (data) {
                        console.log('Successfully created task' + JSON.stringify(data));
                    });
            }else{

            }
            //post deal to channel
            if (args.iparams.requester.DealCreatedGrp) {
                $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/chat.postMessage', {
                    headers: {
                        'Authorization': 'Bearer <%= access_token %>',
                        'Content-Type': 'application/json'
                    },
                    isOAuth: true,
                    formData: {
                        channel: args.iparams.requester.slackGrpName,
                        attachments: JSON.stringify([
                            {
                                "pretext": "Hi! New deal added!",
                                "title": titledata,
                                "text": textdata.toString(),
                                "color": "#439FE0"
                            }
                        ]),
                        //as_user: 'true'
                    }
                })

                    .then(function (response) {
                        console.log('Successfully created task' + JSON.stringify(response));
                    });
            }else{

            }
        },function(err){
            console.error(err);
        });
}
function fnOnDealWonLostPostSlack(args) {
    var dealstage = args.data.associations.deal_stage.name;

    console.log("Deal won/lost is " + dealstage);
    if (dealstage == "Won") {
        fndealWon(args)
        return;
    }
    else if (dealstage == "Lost") {
        fndealLost(args)
        console.log("deal has been lost")
        return;
    }
    else {
        fndealStagedAssigned(args);
    }

}
function fndealStagedAssigned(args) {
    var amount = args.data.deal.amount.value;
    $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/users.lookupByEmail', {
        headers: {
            'Authorization': 'Bearer <%= access_token %>',
            'Content-Type': 'application/json'
        },
        isOAuth: true,
        formData: {
            email: args.data.associations.owner.email
        }
    })

        .then(function (data) {
            console.log('Successfully created task' + JSON.stringify(data));
            var channelid = JSON.parse(data.response).user.id;
            var titledata = args.data.deal.name.value + "\n";
            var textdata = "Owner: " + args.data.associations.owner.name + "\n";
            if(args.data.associations.sales_account){
                textdata += "Account: " + args.data.associations.sales_account.name + "\n";
            }else{

            }
            textdata += "Deal Value: " + amount + "\n";
            textdata += "Deal Stage: " + args.data.associations.deal_stage.name + "\n";
            if (args.data.deal.closed_date.value) {
                titledata += "Closed Date: " + args.data.deal.closed_date.value + "\n";
            }
            else{

            }
            
            if (args.iparams.requester.DealStage && args.data.changes.model_changes.deal_stage_id) {
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
                                "pretext": "Deal under you has reached a certain stage!",
                                "title": titledata,
                                "text": textdata.toString(),
                                "color": "#439FE0"
                            }
                        ]),
                        //as_user: 'true'
                    }
                })

                    .then(function (response) {
                        console.log('Successfully created task' + JSON.stringify(response));
                    });

            } else if (args.iparams.requester.DealAssigned && args.data.changes.model_changes.owner_id) {
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
                                "pretext": "New Deal has been reassigned to you!",
                                "title": titledata,
                                "text": textdata.toString(),
                                "color": "#439FE0"
                            }
                        ]),
                        //as_user: 'true'
                    }
                })

                    .then(function (response) {
                        console.log('Successfully created task' + JSON.stringify(response));
                    });

            }
            else{
                console.log(JSON.stringify(args))
            }
        });
}
function fndealLost(args) {
    var amount = args.data.deal.amount.value;
    $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/users.lookupByEmail', {
        headers: {
            'Authorization': 'Bearer <%= access_token %>',
            'Content-Type': 'application/json'
        },
        isOAuth: true,
        formData: {
            email: args.data.associations.owner.email
        }
    })

        .then(function (data) {
            console.log('Successfully created task' + JSON.stringify(data));
            var channelid = JSON.parse(data.response).user.id;
            var titledata = args.data.deal.name.value + "\n";
            var textdata = "Owner: " + args.data.associations.owner.name + "\n";
            if(args.data.associations.sales_account){
                textdata += "Account: " + args.data.associations.sales_account.name + "\n";
            }else{

            }
            textdata += "Deal Value: " + amount + "\n";
            if (args.data.deal.closed_date.value) {
                titledata += "Closed Date: " + args.data.deal.closed_date.value + "\n";
            }else{

            }
            if (args.iparams.requester.DealLost) {

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
                                "pretext": "You just lost a deal.Let's try to win them back",
                                "title": titledata,
                                "text": textdata.toString(),
                                "color": "#439FE0"
                            }
                        ]),
                        //as_user: 'true'
                    }
                })

                    .then(function (response) {
                        console.log('Successfully created task' + JSON.stringify(response));
                    });

            }else{

            }
            //post deal to channel
            // $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/chat.postMessage', {
            //     headers: {
            //         'Authorization': 'Bearer <%= access_token %>',
            //         'Content-Type': 'application/json'
            //     },
            //     isOAuth: true,
            //     formData: {
            //         channel: args.iparams.requester.slackGrpName,
            //         attachments: JSON.stringify([
            //             {
            //                 "pretext": "Deal Lost!",
            //                 "title": titledata,
            //                 "text": textdata.toString(),
            //                 "color": "#439FE0"
            //             }
            //         ]),
            //         //as_user: 'true'
            //     }
            // })

            //     .then(function (response) {
            //         console.log('Successfully created task' + JSON.stringify(response));
            //     },

            //         function (err) {
            //             console.log('Unable to create deal1' + JSON.stringify(err));
            //         });
        });
}
function fndealWon(args) {
    var amount = args.data.deal.amount.value;
    $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/users.lookupByEmail', {
        headers: {
            'Authorization': 'Bearer <%= access_token %>',
            'Content-Type': 'application/json'
        },
        isOAuth: true,
        formData: {
            email: args.data.associations.owner.email
        }
    }).then(function (data) {
        console.log('Successfully created task' + JSON.stringify(data));
        var channelid = JSON.parse(data.response).user.id;
        var titledata = args.data.deal.name.value + "\n";
        var textdata = "Owner: " + args.data.associations.owner.name + "\n";
        if(args.data.associations.sales_account){
            textdata += "Account: " + args.data.associations.sales_account.name + "\n";
        }
        else{

        }
        textdata += "Deal Value: " + amount + "\n";
        if (args.iparams.requester.DealWon) {
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
                            "pretext": "Deal Won!",
                            "title": titledata,
                            "text": textdata.toString(),
                            "color": "#439FE0"
                        }
                    ]),
                    //as_user: 'true'
                }
            })
                .then(function (response) {
                    console.log('Successfully created task' + JSON.stringify(response));
                });
        }
        //post deal to channel
        if (args.iparams.requester.DealWonGrp) {
            $request.post('https://' + args.iparams.requester.slackUrl + '.slack.com/api/chat.postMessage', {
                headers: {
                    'Authorization': 'Bearer <%= access_token %>',
                    'Content-Type': 'application/json'
                },
                isOAuth: true,
                formData: {
                    channel: args.iparams.requester.slackGrpName,
                    attachments: JSON.stringify([
                        {
                            "pretext": "Deal Won!",
                            "title": titledata,
                            "text": textdata.toString(),
                            "color": "#439FE0"
                        }
                    ]),
                    //as_user: 'true'
                }
            })
                .then(function (response) {
                    console.log('Successfully created task' + JSON.stringify(response));
                });
        }else{

        }
    });
}

exports = {
    createDeal: fnCreateDealPostSlack,
    onDealWonLost: fnOnDealWonLostPostSlack
};