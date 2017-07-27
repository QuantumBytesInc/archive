/**
 * Represents a single item which will be layed on our storage system.
 * The dropping positions will be set by each storage.
 * If item is stacked, there is just one physical item, rest is set in stackedItems.
 * @param {$q} $q
 * @param {UIDB} uiDB
 * @param {$timeout} $timeout
 * @class directive_item
 * @static
 * @constructor
 */

function directive_item($q, uiDB, $timeout) {
    return {
        require: '^storage',
        restrict: 'E',
        templateUrl: window.amazonURL + 'gui/templates/controls/item.html',
        scope: {
            storageId: "@",
            itemId: "@",
            initData: "@"
        },
        controller: ['$scope', '$element', function ($scope, $element) {

            /**
             * The instanced itemId
             * @type {Number}
             */
            $scope.itemId = parseInt($scope.itemId);


            /**
             * Represents the element height/width in a 2D-Model, with the X/Y changes to hover the dropzones
             * @example
             * [{top:0,left:0},{top:-1,left:0},{top:1,left:1}]
             * @type {Array}
             */
            $scope.hoveredRasters = [];
            /**
             * The ITEM-HTML-DOM
             * @type {Element}
             */
            $scope.itemEl = $element;
            var el = $scope.itemEl;

            /**
             * Inherits the actual position of the item, needed for reverting by a false drop-event.
             * @type {Pointer}
             */
            var startPosition = $scope.itemEl.offset();
            /**
             * The item-height, recalculated on dragstart, needed to calculate the hoveredrasters.
             * @type {Number}
             */
            var draggedHeight = $scope.itemEl.height();
            /**
             * The item-width, recalculated on dragstart, needed to calculate the hoveredrasters.
             * @type {Number}
             */
            var draggedWidth = $scope.itemEl.width();
            /**
             * Set on instancing inherits all itemData.
             * @type {null}
             */
            $scope.itemData = null;

            /**
             * If drag is started, variable is false, if the storageevent doesn't reset this to "true" the drop of item dismissed into nirvana.
             * @type {boolean}
             */
            $scope.dropped = true;

            $scope.width = 0;
            $scope.height =0;
            $scope.weight = 0;


            /**
             * Set by watch-event if the stackedItemIds are changed
             * @automatic
             * @type {number}
             */
            $scope.stackSize = 1;
            /**
             * Set by watch if the stackedItemIds are changed.
             * @automatic
             * @type {boolean}
             */
            $scope.isStacked = false;

            /**
             * Set on instanceing (db is parsed for right itemId)
             * @type {string}
             */
            $scope.iconPath = "";
            /**
             * Dropped/set slot+
             * Always resettet on drop event on another slot.
             * @type {number}
             */
            $scope.slot = -1;
            /**
             * Inherits all itemIds which are laying below this item, needed for stacking / unstacking.
             * If more items are laying below this one, they are removed from dom, and just stored as ID here.
             * @type {*[]}
             */
            $scope.stackedItemIds = [$scope.itemId];

            $scope.stackedItemIdsInformation ={};
            /**
             * Needed to disable other events while dragging
             * @type {boolean}
             */
            $scope.isDragging = false;

            /**
             * Checking if the stackedItemIds.length is changed, set our properties automaticly.
             * @event
             */
            $scope.$watch('stackedItemIds.length',
                function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.stackSize = newValue;
                    }
                    else {
                        $scope.stackSize = newValue;
                    }
                    if ($scope.stackSize > 1) {
                        $scope.isStacked = true;
                    }
                    else {
                        $scope.isStacked = false;
                    }
                    /**for(var key in $scope.stackedItemIdsInformation)
                    {
                        if ($scope.stackedItemIds.indexOf(parseInt(key)) === -1)
                        {
                            delete $scope.stackedItemIdsInformation[key];
                        }
                    }

                    for (var i=0;i<$scope.stackedItemIds.length;i++) {
                        if ($scope.stackedItemIdsInformation[$scope.stackedItemIds[i]] === undefined || $scope.stackedItemIdsInformation[$scope.stackedItemIds[i]] === null) {
                            //Information not existing - add them.
                            var itemScope = $scope.ctrlScope.getItemScopeById($scope.stackedItemIds[i]);
                            var obj = {
                                HEIGHT: itemScope.height,
                                WIDTH: itemScope.width,
                                WEIGHT: itemScope.weight
                            };
                            $scope.stackedItemIdsInformation[$scope.stackedItemIds[i]] = obj;
                        }
                    }**/

                }
            );
            /**
             * Return the actual storage
             * @property getStorageId
             * @returns {Number}
             */
            $scope.getStorageId = function () {
                return parseInt($scope.storageId);
            };

            /**
             * /// \todo provide sample data.
             * Returns the actual itemData
             * @property getItemData
             * @returns {*}
             */
            $scope.getItemData = function () {
                return $scope.itemData;
            };

            /**
             * /// \todo provide sample data.
             * Returns the actual item-templateData form DB
             * @property getItemTemplate
             * @returns {*}
             */
            $scope.getItemTemplate = function () {
                return $scope.itemTemplate;
            };

            /**
             * Return actual itemId
             * @property getItemId
             * @returns {Number}
             */
            $scope.getItemId = function () {
                return parseInt($scope.itemId);
            };
            /**
             * ItemId also set to HTML-DOM
             * @property setItemId
             * @param {Number} _itemId
             */
            $scope.setItemId = function (_itemId) {
                $scope.itemId = parseInt(_itemId);
                $scope.itemEl.attr("item-id", $scope.itemId);
            };


            /**
             * Set the actual slotId
             * @property setSlot
             * @writeOnly
             * @param {Number} _slot
             */
            $scope.setSlot = function (_slot) {
                $scope.slot = parseInt(_slot);
            };

            /**
             * Get the actual slotId
             * @property getSlot
             * @returns {Number}
             */
            $scope.getSlot = function getSlot() {
                return parseInt($scope.slot);
            };

            //If an element is cloned (by stack/unstack) needed information will be stored here for our drag and drop events.
            /**
             * CloneInformation won't be null if a SPLIT-Event is ongoing, inherits the originalItemId as a reference to split the dragged items on drop (storage)
             * @type {*}
             */
            $scope.cloneInformation = null;
            /**
             * Called by storage after item was instanced.
             * @property setItemData
             * @writeonly,writeonce
             * @param _data
             * @return
             */
            $scope.setItemData = function setItemData(_data) {
                var deferred = $q.defer();
                if ($scope.itemData === null) {
                    $scope.itemData = _data;
                    var itemAttrs = uiDB.getItem($scope.itemData.TEMPLATE);
                    $scope.itemTemplate = itemAttrs;
                    $scope.iconPath = window.amazonMediaURL  + itemAttrs.ICON;

                    $scope.height = $scope.itemData.HEIGHT;
                    $scope.width = $scope.itemData.WIDTH;
                    $scope.weight = $scope.itemData.WEIGHT;

                    if ($scope.height === -1)
                    {
                        $scope.height = itemAttrs.HEIGHT;
                    }
                    if ($scope.width === -1)
                    {
                        $scope.width = itemAttrs.WIDTH;
                    }
                    if ($scope.weight === -1)
                    {
                        $scope.weight = itemAttrs.WEIGHT;
                    }


                      var obj = {
                                HEIGHT: $scope.height,
                                WIDTH: $scope.width,
                                WEIGHT: $scope.weight
                            };
                    $scope.stackedItemIdsInformation[$scope.itemId] = obj;

                    $("<img>").attr("src", $scope.iconPath).on('load',function () {
                        $scope.itemWidth = this.width;
                        $scope.itemHeight = this.height;
                        el.css("backgroundImage", "url('" + $scope.iconPath + "')");
                        el.css("width", $scope.itemWidth);
                        el.css("height", $scope.itemHeight);
                        calculateRaster(0, 0, 0, 0);
                        deferred.resolve($scope);
                    });


                }
                else {
                    $timeout(function () {
                        deferred.resolve();
                     },0,false);
                }
                return deferred.promise;
            };
            /**
             * Triggered on drag-start.
             * Sets "hoveredRasters". Calculates the rasters width/height on the mouse-location to rightly calculate the drop / hover event
             * @event calculateRaster
             * @param {Number} _mouseX
             * @param {Number} _mouseY
             * @param {Number} _elX
             * @param {Number} _elY
             */
            var calculateRaster = function (_mouseX, _mouseY, _elX, _elY) {

                var rasterRows = draggedHeight / 58;
                var rasterCols = draggedWidth / 58;

                var mouseKoordX = _mouseX - _elX || 0;
                var mouseKoordY = _mouseY - _elY || 0;


                var rasterRowsCount = -1;
                var rasterColsCount = -1;


                $scope.hoveredRasters = [];

                var usedRaster = {top: 0, left: 0};

                for (var i = 1; i <= rasterRows; i++) {
                    for (var z = 1; z <= rasterCols; z++) {

                        var notUsedRaster = {top: 0, left: 0};
                        notUsedRaster.left = z;
                        notUsedRaster.top = i;

                        //Get the actual mouse position (in which raster are we?)
                        if (z * 58 >= mouseKoordX && rasterColsCount == -1) {
                            rasterColsCount = z;
                        }
                        if (i * 58 >= mouseKoordY && rasterRowsCount == -1) {
                            rasterRowsCount = i;
                        }

                        //If we got both rasters check if this raster is our raster and remember.
                        if (rasterRowsCount !== -1 && rasterColsCount !== -1) {
                            if (notUsedRaster.left === rasterColsCount && notUsedRaster.top === rasterRowsCount) {
                                usedRaster.left = rasterColsCount;
                                usedRaster.top = rasterRowsCount;
                                break;
                            }

                        }
                    }

                }

                //Reset.
                rasterRowsCount = -1;
                rasterColsCount = -1;
                for (var i = 1; i <= rasterRows; i++) {

                    for (var z = 1; z <= rasterCols; z++) {

                        var notUsedRaster = {top: 0, left: 0};
                        notUsedRaster.left = z;
                        notUsedRaster.top = i;

                        if (z * 58 >= mouseKoordX && rasterColsCount == -1) {
                            rasterColsCount = z;
                        }

                        if (i * 58 >= mouseKoordY && rasterRowsCount == -1) {
                            rasterRowsCount = i;
                        }


                        //Brainfuck - caclulate where the mouse is actual clicked, and get the raster where we need to hover later on.
                        //Calculate the col/top differences for our HOVER/DROP later
                        if (rasterRowsCount !== -1 && rasterColsCount !== -1) {
                            if (notUsedRaster.left === rasterColsCount && notUsedRaster.top === rasterRowsCount) {
                            }
                            else {
                                if (usedRaster.left === notUsedRaster.left) {
                                    notUsedRaster.left = 0;
                                }
                                else if (usedRaster.left < notUsedRaster.left) {
                                    notUsedRaster.left = (notUsedRaster.left - usedRaster.left);
                                }
                                else if (usedRaster.left > notUsedRaster.left) {
                                    notUsedRaster.left = -(usedRaster.left - notUsedRaster.left);
                                }

                                if (usedRaster.top === notUsedRaster.top) {
                                    notUsedRaster.top = 0;
                                }
                                else if (usedRaster.top < notUsedRaster.top) {
                                    notUsedRaster.top = (notUsedRaster.top - usedRaster.top);
                                }
                                else if (usedRaster.top > notUsedRaster.top) {
                                    notUsedRaster.top = -(usedRaster.top - notUsedRaster.top);
                                }
                                $scope.hoveredRasters.push(notUsedRaster)

                            }
                        }
                        else {
                            if (usedRaster.left === notUsedRaster.left) {
                                notUsedRaster.left = 0;
                            }
                            else if (usedRaster.left < notUsedRaster.left) {
                                notUsedRaster.left = (notUsedRaster.left - usedRaster.left);
                            }
                            else if (usedRaster.left > notUsedRaster.left) {
                                notUsedRaster.left = -(usedRaster.left - notUsedRaster.left);
                            }

                            if (usedRaster.top === notUsedRaster.top) {
                                notUsedRaster.top = 0;
                            }
                            else if (usedRaster.top < notUsedRaster.top) {
                                notUsedRaster.top = (notUsedRaster.top - usedRaster.top);
                            }
                            else if (usedRaster.top > notUsedRaster.top) {
                                notUsedRaster.top = -(usedRaster.top - notUsedRaster.top);
                            }

                            notUsedRaster.left = (notUsedRaster.left);
                            notUsedRaster.top = (notUsedRaster.top);
                            $scope.hoveredRasters.push(notUsedRaster)
                        }


                    }

                }
            };

            /**
             * Returns the actual startPosition
             * @property getPosition
             * @returns {Pointer}
             */
            $scope.getPosition = function () {
                return startPosition;
            };

            /**
             * Revert the actual item to his starting position before drag was executed.
             * @method
             */
            $scope.revertDrag = function () {
                $scope.itemEl.offset({top: startPosition.top, left: startPosition.left});
            };

            /**
             * Executed on drag-start event.
             * -> Shift-CLICK-Draggs are disabled.
             * @event itemStartDrag
             * @param {event} _event
             * @param {Element} _ui
             * @returns {boolean}
             */
            $scope.itemStartDrag = function itemDrag(_event, _ui) {

                    $scope.isDragging = true;
                    //Move the whole bunch stacked or unstacked.
                    $scope.dropped = false;
                    startPosition = $scope.itemEl.offset();
                    draggedHeight = $scope.itemEl.height();
                    draggedWidth = $scope.itemEl.width();
                    var mouseX = event.clientX;
                    var mouseY = event.clientY;
                    var elX = _ui.offset.left;
                    var elY = _ui.offset.top;
                    calculateRaster(mouseX, mouseY, elX, elY);

                    $scope.ctrlScope.itemDragStart($scope);

            };

            /**
             * Nothing todo here atm.
             * @event itemDrag
             * @param {event} _event
             * @param _ui
             */
            $scope.itemDrag = function (_event, _ui) {

            };

            /**
             * Called when item stopped dragging
             * Check if the item was dropped outside a storage, if yes, revert.
             * @event itemDragStop
             * @param {event} _event
             * @param {Element} _ui
             */
            $scope.itemDragStop = function (_event, _ui) {

                 $scope.ctrlScope.itemDragStopped($scope);
                if ($scope.dropped === false) {
                    if ($scope.cloneInformation !== null) {
                        //Unstack event failed.
                        $scope.destroy();
                    }
                    else {
                        //Check if we dropped element outside of an "dropable" area. if yes (dropped = false), reset.
                        $scope.revertDrag();
                        $scope.dropped = true;
                    }

                }


                //Execute in timeout else if you pressed shift while "clicked", the click event is triggering for split.
                $timeout(function () {
                    $scope.isDragging = false;
                },0,false);


            };

            /**
             * Called from storage-system
             * @method
             * @param {$scope} _parentScope
             */
            $scope.dropFinished = function (_parentScope) {
                if ($scope.storageId !== _parentScope.storageId) {
                    //Say old parent we're not his item anymore.
                    $scope.ctrlScope.itemRemoved($scope);
                }
                $scope.ctrlScope = _parentScope;
                $scope.storageId = _parentScope.storageId;
                $element.attr("storage-id", $scope.storageId)
            };

            $scope.destroy = function destroy() {
                $scope.$destroy();
                $scope.itemEl.remove();
            };

            //Calculate raster pre - needed if item will be set by parent-scope.
            calculateRaster(0, 0, 0, 0);

        }
        ],
        link: function (scope, el, attrs, controller) {

            var dragableItem = $(el);
            //Inherit the controller scope to talk
            scope.ctrlScope = controller.getScope();

            //Call storage that we're ready instanced - item is set by storage system to his right slot.
            scope.ctrlScope.itemInstanced(scope, JSON.parse(scope.initData));
            /**
             * Dont wanna explain dat...
             * Split the item on click event - copy the actual item
             */
            dragableItem.on("click", function (_event) {
                if (scope.isDragging === true) {
                    return;
                }
                if (_event.shiftKey === true) {
                    if (scope.isStacked === true) {

                        //Create a new clone of the actual item.
                        scope.ctrlScope.copyItem(scope.getItemId(), scope.getItemTemplate().ID).then(function (_scope, _item) {
                                //Set the actual item data from this scope to the "copyed" one.
                                _scope.setItemData(scope.getItemData()).then(function () {
                                    //Set the same slot.
                                    _scope.setSlot(scope.getSlot());
                                    //Reset the stackedItemIds else wrong information in it
                                    _scope.stackedItemIdsInformation = {};
                                    _scope.itemEl.hide();

                                    //We don't lay a new HTML-JS-Controller behind this, not needed and overloaded, so do this via jQuery
                                    var htmlOverlay = $('<div class="itemseparator-container" data-id="itemSeparator">' +
                                    '<input type="number" data-id="itemCount" value="" min="1" max="">' +
                                    '<input type="button" class="split-split" data-id="itemCallback" value="split">' +
                                    '<input type="button" class="split-cancel" data-id="itemCallbackC" value="cancel">' +
                                    '</div>');

                                    var itemSeparatorCount = htmlOverlay.find("[data-id='itemCount']");
                                    itemSeparatorCount.attr("value", 1).attr("max", scope.stackedItemIds.length - 1);
                                    //Disable more input via key, else the max-value could be exceeded.
                                    itemSeparatorCount.keypress(function (evt) {
                                        evt.preventDefault();
                                    });
                                    htmlOverlay.find("[data-id='itemCallback']").click(function (e) {
                                        //Retriev the number of elements which shall be splitted
                                        var sepVal = parseInt(htmlOverlay.find("[data-id='itemCount']").val());
                                        if (typeof(sepVal) === "string") {
                                            //Fallback
                                            sepVal = 1;
                                        }
                                        ///Set the new itemId which shall be splitted to the actual scope.
                                        var sepItemIds = [];


                                        for (var i = 0; i < scope.stackedItemIds.length; i++) {
                                            //Don't find the "parent itemid" thats the real item, the rest just fictive.
                                            if (scope.stackedItemIds[i] !== scope.getItemId()) {
                                                var stackedId = scope.stackedItemIds[i];
                                                sepItemIds.push(stackedId);

                                                if (sepVal === sepItemIds.length) {
                                                    break;
                                                }
                                            }
                                        }
                                        _scope.setItemId(sepItemIds[0]);
                                        _scope.height = scope.stackedItemIdsInformation[sepItemIds[0]].HEIGHT;
                                        _scope.width = scope.stackedItemIdsInformation[sepItemIds[0]].WIDTH;
                                        _scope.weight = scope.stackedItemIdsInformation[sepItemIds[0]].WEIGHT;
                                        for (var i=0;i<sepItemIds.length;i++) {
                                            _scope.stackedItemIdsInformation[sepItemIds[i]] = scope.stackedItemIdsInformation[sepItemIds[i]];
                                        }
                                        _scope.stackedItemIds = sepItemIds;


                                        //TODo - check if more then one - if yes we're again stacked.
                                        _scope.isStacked = false;
                                        _scope.cloneInformation = {
                                            originalItem: scope.getItemId()

                                        };
                                        //Sync angular if needed.
                                        if (!_scope.$$phase) {
                                            _scope.$apply();
                                        }
                                        _scope.itemEl.show();
                                        _scope.itemEl.offset({top: e.pageY, left: e.pageX});
                                        //trigger a mousedown to start a drag
                                        /**Dirty hack, reset the click event to mouse draggable, so the item will be attached on mouse move now**/
                                        e.type = "mousedown.draggable";
                                        e.target = _scope.itemEl[0];
                                        _scope.itemEl.trigger(e);
                                        /** Dirty hack end **/
                                        htmlOverlay.remove();
                                    });
                                    htmlOverlay.find("[data-id='itemCallbackC']").click(function () {
                                        _scope.destroy();
                                        htmlOverlay.remove();
                                    });
                                    htmlOverlay.appendTo(scope.ctrlScope.$element).css("position", "absolute").css("z-index", 99999).css("width", "100%").offset({
                                        top: _event.pageY,
                                        left: _event.pageX
                                    });
                                    //Focus our input
                                    itemSeparatorCount.focus();


                                });
                            }
                        );

                        //Return false disables the start -drag event.
                        return false;

                    }
                    else {
                        return false;
                    }
                }
            });

            scope.draggableEl = jQuery(dragableItem).draggable({
                start: scope.itemStartDrag,
                drag: scope.itemDrag,
                stop: scope.itemDragStop,
                zIndex: 9999,
                containment: 'window',
                scroll: false
            });


        }
    }
}