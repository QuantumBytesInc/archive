angular.module('App.controllers', [ ])
.controller("bodyController",['$scope','$state','$translate','uiService','uiCommunicate','uiCommunicateModel','helperService','$interval','uiDB','uiUser',BodyController])
.controller("loginController",['$scope','uiService','uiCommunicate','uiCommunicateModel','helperService','logService','uiUser',LoginController])
.controller("logController",['$scope','logService','uiService',LogController])
.controller("escController",['$scope','uiService','uiCommunicate','uiCommunicateModel','helperService','uiUser',EscController])
.controller("settingsController",['$scope','logService','uiService','uiCommunicate','uiCommunicateModel','helperService','uiControllerData','$translate','$q',SettingsController])
.controller("helpController",['$scope','uiService','uiCommunicate','helperService',HelpController])
.controller("temporaryController",['$scope','uiService','uiCommunicate','helperService',TemporaryController])
.controller("informationController",['$scope','uiService','uiCommunicate','helperService','logService','$timeout',InformationController])

//Game Controller

.controller("charSelectionController",['$scope','uiService','uiCommunicate','uiCommunicateModel','helperService','logService','uiUser',CharSelectionController])
.controller("charCreationController",['$scope','uiService','uiCommunicate','uiCommunicateModel','helperService','logService','uiControllerData',CharCreationController])
.controller("topbarController",['$scope','$interval','uiService','uiCommunicate','uiCommunicateModel','helperService','logService','uiSocket','uiCommunicateSocketModel', TopbarController])
.controller("chatController",['$scope','$compile','logService','uiService','uiCommunicate','uiCommunicateModel',ChatController])
.controller("taskbarController",['$scope', 'uiService', 'uiCommunicate', 'uiCommunicateModel', 'logService','$timeout',TaskbarController])
.controller("storageController",['$scope', '$compile', '$q','uiCommunicate','uiCommunicateModel','logService','uiSocket','uiCommunicateSocketModel', StorageController])
.controller("overlayController",['$scope', 'uiService', 'uiCommunicate', 'helperService', 'logService','$timeout','uiDB',OverlayController])
.controller("gatheringMiningController",['$scope','uiService','uiCommunicate','uiCommunicateModel','helperService','logService',GatheringMiningController]);



