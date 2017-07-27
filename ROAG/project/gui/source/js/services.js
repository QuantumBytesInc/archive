angular.module('App.services', [])
 .service("logService",[LogService])
.service("uiDB",['$http','logService',UIDB])
.service("uiUser",['logService',UIUser])
.service("helperService",['$translate',HelperService])
.service('uiService',["$q",'$compile','$state','$timeout','$interval',"helperService","logService","$rootScope", UIService])
.service('uiCommunicate',["$q",'$timeout','$rootScope',"helperService","logService","uiService","uiCommunicateData","uiChannelData","uiBroadcastData",'uiUser', UICommunicate])
.service('uiSocket',["$q","logService","$timeout","uiCommunicate","uiCommunicateSocketData","helperService", UISocket])


.factory('uuid',[factory_uuid]);