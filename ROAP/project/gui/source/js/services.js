angular.module('App.services', [])
.service('uiCommunicate',["$q","uiCommunicateData",UICommunicate])
.service('notificationManager',["$rootScope", "$timeout", NotificationManager])
.service('metatagFormatter',["$rootScope", MetatagFormatter]);
