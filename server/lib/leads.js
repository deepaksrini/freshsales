function createLead(args) {
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
    }).then(function (data) {
        console.log('lead created task' + JSON.stringify(data));
        var channelid = JSON.parse(data.response).user.id;
        var textdata = "";
        var titledata = "";
        titledata += args.data.lead.name.value + "\n";
        textdata += "Owner: " + args.data.associations.owner.name + "\n";
        if (args.data.lead.company.name.value) {
            textdata += "Company Name: " + args.data.lead.company.name.value + "\n";
        }
        else{

        }
        if (args.data.lead.work_number.value) {
            textdata += "Work: " + args.data.lead.work_number.value;
        }
        else{

        }
        if (args.iparams.requester.LeadCreated) {
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
                            "pretext": "A new lead has been assigned to you!",
                            "title": titledata,
                            "text": textdata.toString(),
                            "color": "#7CD197"
                        }
                    ]),
                }
            })

                .then(function (response) {
                    console.log('Successfully created task' + JSON.stringify(response));
                });
        }
        else{

        }
        if (args.iparams.requester.LeadCreatedGrp) {
            //post deal to channel
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
                            "pretext": "New Lead!",
                            "title": titledata,
                            "text": textdata.toString(),
                            "color": "#7CD197"
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
            
        }
    });
}

function stageUpdateLead(args) {
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
    }).then(function (data) {
        console.log('lead created task' + JSON.stringify(data));
        var channelid = JSON.parse(data.response).user.id;
        var textdata = "";
        var titledata = "";
        titledata += args.data.lead.name.value + "\n";
        textdata += "Owner: " + args.data.associations.owner.name + "\n";
        if(args.data.lead.company.name.value){
            textdata += "Company Name: " + args.data.lead.company.name.value + "\n";
        }
        textdata += "Lead Stage: " + args.data.associations.lead_stage.name + "\n";
        if (args.data.lead.work_number.value) {
            textdata += "Work: " + args.data.lead.work_number.value;
        }
        if (args.iparams.requester.LeadStage && args.data.changes.model_changes.lead_stage_id) {
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
                            "pretext": "New stage has been updated for lead under you!",
                            "title": titledata,
                            "text": textdata.toString(),
                            "color": "#7CD197"
                        }
                    ]),
                }
            })

                .then(function (response) {
                    console.log('Successfully created task' + JSON.stringify(response));
                });
        }
        else if (args.iparams.requester.LeadAssigned && args.data.changes.model_changes.owner_id) {
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
                            "pretext": "New Lead has been reassigned to you!",
                            "title": titledata,
                            "text": textdata.toString(),
                            "color": "#7CD197"
                        }
                    ]),
                }
            })

                .then(function (response) {
                    console.log('Successfully created task' + JSON.stringify(response));
                });
        }
    });
}
exports = {
    createLead: createLead,
    stageUpdateLead: stageUpdateLead
};

