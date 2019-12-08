var libleads = require("./lib/leads");
var libdeals = require("./lib/deals");
var libscheduler = require("./lib/Scheduler");
exports = {

  events: [
    { event: 'onLeadCreate', callback: 'onLeadCreateHandler' },
    { event: 'onLeadUpdate', callback: 'onLeadUpdateHandler' },
    { event: 'onDealCreate', callback: 'onDealCreateHandler' },
    { event: 'onDealUpdate', callback: 'onDealUpdateHandler' },
    { event: 'onAppInstall', callback: 'onAppInstallEventHandler' },
    { event: 'onAppUninstall', callback: 'onAppUninstallEventHandler' },
    { event: 'onScheduledEvent', callback: 'onScheduledEventHandler' }
  ],
  onAppUninstallEventHandler: function (args) {
    console.log(JSON.stringify(args));
    console.log("On App unInstall ", args);
    $schedule.delete({
      name: "InactiveDeals"
    })
      .then(function (data) {
        console.log("delete scheduler", data);
        //"data" is a json with status and message.
      });
    $schedule.delete({
      name: "ExceededExpecteddate"
    })
      .then(function (data) {
        console.log("delete scheduler", data);
        renderData();
        //"data" is a json with status and message.
      }, function () {
        //console.error("delete scheduler", err);
        renderData();
        //"err" is a json with status and message.
      });

  },
  onAppInstallEventHandler: function (args) {
    console.log(JSON.stringify(args));
    console.log("On App Install ", JSON.stringify(args));
    console.log("AppInstall initiated");
    var dt = new Date();
    dt.setSeconds(dt.getSeconds() + 20);
    if (args.iparams.requester.DealInactive) {
      $schedule.create({
        name: "InactiveDeals",
        data: { task_id: 1 },
        schedule_at: dt.toISOString(),
        repeat: {
          time_unit: "days",
          frequency: +args.iparams.requester.inactiveDeals
        }
      })
        .then(function (data) {
          console.log("task created", data)
        });
    }else{}
    if (args.iparams.requester.DealClosed) {
      $schedule.create({
        name: "ExceededExpecteddate",
        data: { task_id: 2 },
        schedule_at: dt.toISOString(),
        repeat: {
          time_unit: "days",
          frequency: 1
        }
      })
        .then(function (data) {
          console.log("task created", data)
        });
    }else{}
    renderData();
  },
  onScheduledEventHandler: function (payload) {
    console.log("Scheduled initiated" + JSON.stringify(payload));
    if (payload.data.task_id == 1) {
      libscheduler.InactiveDeals(payload);
    }
    else if (payload.data.task_id == 2) {
      libscheduler.ExceededCloseddate(payload);
    }else{}
  },
  onLeadCreateHandler: function (args) {
    console.log(JSON.stringify(args));
    console.log("Lead Create initiated");
    console.log(JSON.stringify(args));
    libleads.createLead(args);
    console.log("Lead ended");
  },
  onDealCreateHandler: function (args) {
    libdeals.createDeal(args)
  },
  onDealUpdateHandler: function (args) {
    console.log(JSON.stringify(args));
    console.log("deal updated initiated", args);
    console.log(JSON.stringify(args));
    libdeals.onDealWonLost(args)
    console.log("deal updated ended");
  },
  onLeadUpdateHandler: function (args) {
    console.log(JSON.stringify(args));
    console.log("Lead updated initiated");
    libleads.stageUpdateLead(args);
    console.log("Lead updated ended");
  }
};