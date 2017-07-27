/**
 *
 * @param {$compile} $compile
 * @param {$timeout} $timeout
 * @param {UIDB} uiDB
 * @param {UICommunicate} uiCommunicate
 * @param {UICommunicateSocketModel} uiCommunicateSocketModel
 * @param {uuid} uuid
 * @param {$q} $q
 * @class directive_storage
 * @static
 * @constructor
 */
function directive_storage($compile, $timeout, uiDB, uiCommunicate, uiCommunicateSocketModel, uuid, $q) {
    return {
        restrict: 'E',
        templateUrl: window.amazonURL + 'gui/templates/controls/storage.html',
        scope: {
            storageInit: "&storageInit",
            storageId: "@"
        },
        controller: ['$scope', '$element', function ($scope, $element) {

            var el = null;
            //Inherit every dropable tile. (items will be stored above)
            var tiles = {};
            var tileRows = {};
            var tolerance = "pointer";
            var storage = null;


            /**
             * Will be filled in the initStorage function
             * @private
             * @type {string}
             */
            var storageSocketURL = "";
            /**
             * Count up by every instance.
             * @type {number}
             */
            var createItemInstanceId = 0;
            /**
             * Stores the promise to resolve when item was globaly finished.
             * @type {{}}
             */
            var createItemInstanceCallbacks = {};

            /**
             * The actual Storage-DOM
             */
            $scope.$element = $element;


            el = $element;
            /**
             * UniqueID, needed for bring to front events.
             */
            $scope.uniqueId = uuid.new();
            /**
             * The storage width, set on instance
             * @type {Number}
             */
            $scope.width = 0;
            /**
             * The storage height, set on instance
             * @type {Number}
             */
            $scope.height = 0;
            /**
             * The tiles offset X set on instance
             * @type {Number}
             */
            $scope.startX = 0;
            /**
             * The tiles offset Y set on instance
             * @type {Number}
             */
            $scope.startY = 0;
            /**
             * The storage image, set on instance
             * @type {String}
             */
            $scope.storageImagePath = "";

            /**
             * Is this storage a bank =1 or not =0
             * Set on init
             * @private
             * @type {number}
             */
            $scope.isBank = 0;

            /**
             * Maxweight of the storage, set on init
             * Bank is excluded by max-weight
             * @private
             * @type {number}
             */
            $scope.maxWeight = 0.0;

            /**
             * Inherits the actual weight
             * @private
             * @type {number}
             */
            $scope.actualWeight = 0.0;


            /**
             * Pagesizes of the actual storage
             * @private
             * @type {number}
             */
            $scope.pageSize = 1;

            /**
             * Actual selected page
             * @private
             * @type {number}
             */
            $scope.actualPage = 0;

            var inited = false;

            /**
             * Init the storage, called from storage-controller
             * @writeonce
             * @param {} _storage
             */
            $scope.initStorage = function (_storage, _storageSocketURL) {
                if (inited === false && _storage) {
                    storageSocketURL = _storageSocketURL;
                    storage = _storage;

                    if (storage.NAME == "bank") {
                        $scope.isBank = 1;
                    }
                    var storageAttrs = uiDB.getStorage(storage.TEMPLATE);
                    $scope.pageSize = storageAttrs.PAGE_SIZE;
                    $scope.startX = storageAttrs.START_X;
                    $scope.startY = storageAttrs.START_Y;
                    $scope.width = storageAttrs.WIDTH;
                    $scope.height = storageAttrs.HEIGHT;
                    $scope.maxWeight = storageAttrs.WEIGHT;
                    $scope.storageImagePath = window.amazonMediaURL + storageAttrs.IMAGE;

                    /// \todo set padding rightly.
                    //Preload the image and then set the actual width/height.
                    $("<img>").attr("src", $scope.storageImagePath).on('load', function () {
                        $scope.storageWidth = this.width;
                        $scope.storageHeight = this.height;
                        el.css("backgroundImage", "url('" + $scope.storageImagePath + "')");
                        el.css("width", $scope.storageWidth);
                        el.css("height", $scope.storageHeight);

                        /// \todo do this via css
                        el.css("display", "block!important")
                    });
                    inited = true;

                    /** Section needed for generating each cols in storage**/
                    $scope.cols = new Array($scope.width);
                    $scope.rows = new Array($scope.height);


                    //Pregenerate slot-indexes cause not possible in ng-repeat on HTML-Template.
                    $scope.slotIndex = {};
                    var slotIndexCount = 0;
                    for (var pagesCount = 0; pagesCount < $scope.pageSize; pagesCount++) {

                        $scope.slotIndex[pagesCount] = {};
                        for (var i = 0; i < $scope.rows.length; i++) {
                            $scope.slotIndex[pagesCount][i] = {};
                            for (var z = 0; z < $scope.cols.length; z++) {
                                $scope.slotIndex[pagesCount][i][z] = slotIndexCount;
                                slotIndexCount += 1;
                            }
                        }
                    }


                }

            };

            /**
             * Return all tile-rows where the items are stored on.
             * @property getTileRows
             * @returns {*}
             */
            $scope.getTileRows = function () {
                return tileRows["page" + $scope.actualPage];
            };


            /**
             * Return the actual storage id.
             * @property getStorageId
             * @readonly
             * @returns {Number}
             */
            $scope.getStorageId = function () {
                return parseInt($scope.storageId);
            };


            /**
             * Return the item-scope of the actual dragged item.
             * @property getItemScope
             * @private
             * @param _draggedEl
             * @returns {$scope}
             */
            var getItemScope = function getItemScope(_draggedEl) {
                return angular.element(_draggedEl.closest("item")).isolateScope();
            };

            /**
             * Return the item-scope for the passed itemId
             * @property getItemScopeById
             * @private
             * @param {Number} _itemId
             * @returns {$scope}
             */
            var getItemScopeById = function getItemScopeById(_itemId) {
                return angular.element("item[item-id='" + _itemId + "']").isolateScope();
            };

            /**
             * Get the item-scope for the passed id.
             * @property getItemScopeById
             * @param {number} _itemId
             * @returns {$scope}
             */
            $scope.getItemScopeById = function (_itemId) {
                return getItemScopeById(_itemId);
            };

            /**
             * Get all tiles in the actual storage for the given itemId
             * @property getTilesForItem
             * @param {number} _itemId
             * @returns {*|jQuery|HTMLElement}
             */
            $scope.getTilesForItem = function (_itemId) {
                return getTilesForItem(_itemId);
            };

            /**
             * Get the actual tiles where the item is stored on.
             * @method
             * @param {Number} _itemId
             * @returns {*|jQuery|HTMLElement}
             */
            var getTilesForItem = function (_itemId) {

                //Make sure its an int.
                var itemId = parseInt(_itemId);

                var foundTiles = [];
                for (var key in tileRows) {
                    var tiles = tileRows[key].find("[data-itemids]").map(function (_index, _item) {
                        var item = $(_item);
                        var itemIds = JSON.parse(item.attr("data-itemids"));
                        if (itemIds.indexOf(itemId) >= 0) {
                            //Don't returned jQuery object.
                            return _item;
                        }
                    });

                    if (tiles.length > 0) {
                        foundTiles = tiles;
                        break;
                    }
                }


                return $(foundTiles);
            };

            /**
             * Checks if the actual draggedScope can be dropped on the passed dropZones
             * Dropzones are calculated on Hover / Drop event and passed.
             * @method
             * @private
             * @param {Element} _draggedScope
             * @param {Array|Element} _dropZones
             * @returns {boolean}
             */
            var droppable = function (_draggedScope, _dropZones) {

                var itemId = _draggedScope.getItemId();
                var isStackable = _draggedScope.getItemTemplate().IS_STACKABLE;
                var itemTemplateId = parseInt(_draggedScope.getItemData().TEMPLATE);

                if ($scope.isBank === 0) {


                    //Get all items and all stacks on them, calculate the new weight
                    //Take an object and overwrite if needed an already stored itemId to simplify this calculation
                    //Cause we can unstack an item to the same storage and would have the itemId twice.
                    var calculatingWeight = {};
                    $scope.$element.find("item[storage-id=" + $scope.getStorageId() + "]").each(function (index, item) {
                        var itemScope = getItemScopeById($(item).attr("item-id"));
                        for (var key in itemScope.stackedItemIdsInformation) {
                            calculatingWeight[parseInt(key)] = itemScope.stackedItemIdsInformation[parseInt(key)];

                        }
                    });

                    /** Calculate our new weight and check if we don't exceed the max-weight**/
                    for (var key in  _draggedScope.stackedItemIdsInformation) {
                        calculatingWeight[parseInt(key)] = _draggedScope.stackedItemIdsInformation[parseInt(key)];

                    }
                    var newStorageWeight = 0.0;
                    for (var key in calculatingWeight) {
                        newStorageWeight = newStorageWeight + calculatingWeight[parseInt(key)].HEIGHT;
                    }
                    if (newStorageWeight > $scope.maxWeight) {
                        return false;
                    }
                }

                for (var i = 0; i < _dropZones.length; i++) {
                    var itemIds = JSON.parse(_dropZones[i].attr("data-itemids"));


                    if (itemIds.indexOf(-1) < 0 && itemIds.indexOf(itemId) < 0) {
                        if (isStackable === 0) {
                            //Item cant be stacked, so jump out
                            return false;
                        }
                        else {
                            //Is this item from the same type?
                            if (itemIds.length >= 1) {

                                //More items are stacked here, check if its the same type, just take the first item.
                                //Each items in this array needs to be from the same type - else the server passed wrong data.

                                if (_draggedScope.cloneInformation === null) {


                                    var templateId = parseInt(_dropZones[i].attr("data-templateid"));
                                    if (templateId !== itemTemplateId) {
                                        return false;
                                    }
                                    else {
                                        //We just need to check the first itemId - cause if stacked, the rest needs to have the same width / height
                                        var itemScope = getItemScopeById(itemIds[0]);
                                        if (itemScope.height !== _draggedScope.height || itemScope.width !== _draggedScope.width) {
                                            return false;
                                        }

                                        //Check if the stacksize will be exceeded, take the actual items stored here +  the length of the stacked items and check the stacksize
                                        if (itemScope.itemTemplate.STACK_SIZE < itemIds.length + _draggedScope.stackedItemIds.length) {
                                            return false;
                                        }
                                        // we cant return true here, cause we just hovered one tile .
                                    }
                                }
                                else {
                                    var templateId = parseInt(_dropZones[i].attr("data-templateid"));
                                    if (templateId !== itemTemplateId) {
                                        return false;
                                    }
                                    else {
                                        //We just need to check the first itemId - cause if stacked, the rest needs to have the same width / height
                                        var itemScope = getItemScopeById(itemIds[0]);
                                        if (itemScope.height !== _draggedScope.height || itemScope.width !== _draggedScope.width) {
                                            return false;
                                        }
                                        //Check if the stacksize will be exceeded, take the actual items stored here +  the length of the stacked items and check the stacksize
                                        if (itemScope.itemTemplate.STACK_SIZE < itemIds.length + _draggedScope.stackedItemIds.length) {
                                            return false;
                                        }
                                    }
                                }


                            }
                            else {
                                //Just one item stored here, not the same type exit.
                                return false;
                            }

                        }

                    }
                    else if (itemIds.indexOf(itemId) >= 0) {
                        //item already placed here, just again hovered.
                        return true;
                    }
                }


                return true;
            };

            /**
             * Item is dropped, check if we can store it, else revert.
             * Store = Stack / Unstack / Move / Add
             * @event dropItem
             * @private
             * @param {event} _event
             * @param {Element} _ui - Inherits the actual dragged element
             */
            var dropItem = function (_event, _ui) {
                var itemScope = getItemScope(_ui.draggable);

                var itemRasters = itemScope.hoveredRasters;
                var rowIndex = $(this).data("row-index");
                var colIndex = $(this).data("col-index");
                var slotIndex = $(this).data("slot-index");

                var smallestTop = rowIndex;
                var smallestLeft = colIndex;

                var rasterEls = [];
                var canDrop = true;
                var foundSmallerOne = false;
                for (var i = 0; i < itemRasters.length; i++) {

                    if (smallestTop > (rowIndex + itemRasters[i].top)) {
                        foundSmallerOne = true;
                        smallestTop = rowIndex + itemRasters[i].top;
                    }
                    if (smallestLeft > (colIndex + itemRasters[i].left)) {
                        foundSmallerOne = true;
                        smallestLeft = colIndex + itemRasters[i].left;
                    }

                    var rasterEl = tileRows["page" + $scope.actualPage].find("[data-row-index=" + (rowIndex + itemRasters[i].top) + "][data-col-index=" + (colIndex + itemRasters[i].left) + "]");
                    if (rasterEl === null || rasterEl === undefined || rasterEl.length <= 0) {
                        //Dragged out of corner.
                        rasterEls = [];
                        canDrop = false;
                        break;
                    }
                    else {
                        rasterEls.push(rasterEl);
                    }

                }
                if (foundSmallerOne) {
                    rasterEls.push(tileRows["page" + $scope.actualPage].find("[data-row-index=" + (smallestTop) + "][data-col-index=" + (smallestLeft) + "]"));
                }
                rasterEls.push($(this));
                itemScope.dropped = true;

                var foundTiles = getTilesForItem(itemScope.getItemId());


                var matchingTiles = 0;
                for (var i = 0; i < foundTiles.length; i++) {
                    for (var z = 0; z < rasterEls.length; z++) {
                        if (foundTiles[i] == rasterEls[z][0]) {
                            matchingTiles += 1;
                        }
                    }
                }

                if (matchingTiles == rasterEls.length) {
                    //Same drop position
                    if (itemScope.cloneInformation !== null) {

                        var foundOriginalTiles = getTilesForItem(itemScope.cloneInformation.originalItem);
                        foundOriginalTiles.removeClass("hover-enabled").removeClass("hover-disabled").addClass("dropped");
                        itemScope.destroy();
                    }
                    else {
                        //Same drop position;
                        revertDrop(itemScope);
                    }


                    return;
                }


                if (canDrop === true && droppable(itemScope, rasterEls) === true) {
                    //Remove class dropped, would be added if drop isn't possible, but to don't show "delay" to user.
                    var itemIsStacking = false;
                    var foundTiles = getTilesForItem(itemScope.getItemId());
                    foundTiles.removeClass("dropped");

                    if (itemScope.isStacked === false) {
                        for (var i = 0; i < rasterEls.length; i++) {
                            var rasterItemIds = JSON.parse(rasterEls[i].attr("data-itemids"));

                            if (rasterItemIds.indexOf(-1) >= 0) {

                            }
                            else {
                                //Item will be stacked.
                                itemIsStacking = true;
                                break;
                            }

                        }
                    }
                    else {

                        for (var i = 0; i < rasterEls.length; i++) {
                            var rasterItemIds = JSON.parse(rasterEls[i].attr("data-itemids"));

                            if (rasterItemIds.indexOf(-1) >= 0) {

                            }
                            else {
                                //Item will be stacked.
                                itemIsStacking = true;
                                break;
                            }
                        }

                    }


                    var droppedTile = tileRows["page" + $scope.actualPage].find("[data-row-index=" + (smallestTop) + "][data-col-index=" + (smallestLeft) + "]");


                    var droppedSlot = droppedTile.data("slot-index");
                    //Add item to the new storage, else if we would toggle the item would be displayed.


                    if (itemScope.cloneInformation !== null && itemIsStacking == false) {
                        //Item was cloned (so unstacked)
                        unstackItem(itemScope.stackedItemIds, itemScope.getStorageId(), $scope.getStorageId(), itemScope.getSlot(), droppedSlot).then(function (_data) {
                            if (_data.CODE === 0) {
                                //item was cloned unstack original item
                                if (itemScope.cloneInformation !== null) {
                                    var originalScope = getItemScopeById(itemScope.cloneInformation.originalItem);
                                    var stackedIds = originalScope.stackedItemIds;

                                    if (itemScope.isStacked === true) {
                                        for (var i = 0; i < itemScope.stackedItemIds.length; i++) {
                                            stackedIds.splice($.inArray(itemScope.stackedItemIds[i], stackedIds), 1);
                                        }
                                    }
                                    else {
                                        stackedIds.splice($.inArray(itemScope.getItemId(), stackedIds), 1);
                                    }
                                    originalScope.stackedItemIds = stackedIds;


                                }
                            }
                            if (_data.CODE === 0 && itemScope.getStorageId() !== $scope.getStorageId()) {
                                $scope.$element.find("table[data-page='" + $scope.actualPage + "']").append(itemScope.itemEl);
                                //Reset the storage with the old storageId.

                                var oldStorage = angular.element($("storage[storage-id='" + itemScope.getStorageId() + "']")).isolateScope();
                                oldStorage.itemRemoved(itemScope);
                            }
                            finishDrop(_data, itemScope, itemIsStacking, droppedTile, foundTiles, rasterEls);
                        });
                    }
                    else if (itemScope.cloneInformation !== null && itemIsStacking == true) {
                        //Item was cloned and is stacking again.
                        stackItem(itemScope.stackedItemIds, itemScope.getStorageId(), $scope.getStorageId(), itemScope.getSlot(), droppedSlot).then(function (_data) {
                            if (_data.CODE === 0) {
                                //item was cloned unstack original item
                                if (itemScope.cloneInformation !== null) {
                                    var originalScope = getItemScopeById(itemScope.cloneInformation.originalItem);
                                    var stackedIds = originalScope.stackedItemIds;

                                    if (itemScope.isStacked === true) {
                                        for (var i = 0; i < itemScope.stackedItemIds.length; i++) {
                                            stackedIds.splice($.inArray(itemScope.stackedItemIds[i], stackedIds), 1);
                                        }
                                    }
                                    else {
                                        stackedIds.splice($.inArray(itemScope.getItemId(), stackedIds), 1);
                                    }
                                    originalScope.stackedItemIds = stackedIds;
                                    if (!originalScope.$$phase) {
                                        originalScope.$apply();
                                    }

                                }
                            }
                            if (_data.CODE === 0 && itemScope.getStorageId() !== $scope.getStorageId()) {
                                $scope.$element.find("table[data-page='" + $scope.actualPage + "']").append(itemScope.itemEl);
                                //Reset the storage with the old storageId.

                                var oldStorage = angular.element($("storage[storage-id='" + itemScope.getStorageId() + "']")).isolateScope();
                                oldStorage.itemRemoved(itemScope);
                            }
                            finishDrop(_data, itemScope, itemIsStacking, droppedTile, foundTiles, rasterEls);
                        });
                    }
                    else if (itemIsStacking) {
                        //Real item is stacking
                        stackItem(itemScope.stackedItemIds, itemScope.getStorageId(), $scope.getStorageId(), itemScope.getSlot(), droppedSlot).then(function (_data) {
                            if (_data.CODE === 0 && itemScope.getStorageId() !== $scope.getStorageId()) {
                                $scope.$element.find("table[data-page='" + $scope.actualPage + "']").append(itemScope.itemEl);
                                //Reset the storage with the old storageId.

                                var oldStorage = angular.element($("storage[storage-id='" + itemScope.getStorageId() + "']")).isolateScope();
                                oldStorage.itemRemoved(itemScope);
                            }
                            finishDrop(_data, itemScope, itemIsStacking, droppedTile, foundTiles, rasterEls);
                        });
                    }
                    else if (itemScope.getStorageId() !== $scope.getStorageId()) {

                        //move
                        moveItem(itemScope.getItemId(), itemScope.getStorageId(), $scope.getStorageId(), itemScope.getSlot(), droppedSlot).then(function (_data) {
                            if (_data.CODE === 0) {
                                $scope.$element.find("table[data-page='" + $scope.actualPage + "']").append(itemScope.itemEl);
                                //Reset the storage with the old storageId.

                                var oldStorage = angular.element($("storage[storage-id='" + itemScope.getStorageId() + "']")).isolateScope();
                                oldStorage.itemRemoved(itemScope);
                            }
                            //If code !== 0 , finishDrop will revert item.
                            finishDrop(_data, itemScope, itemIsStacking, droppedTile, foundTiles, rasterEls);
                        })

                    }
                    else {
                        //SWAP
                        swapItem(itemScope.getItemId(), $scope.getStorageId(), itemScope.getSlot(), droppedSlot).then(function (_data) {
                            finishDrop(_data, itemScope, itemIsStacking, droppedTile, foundTiles, rasterEls);
                        })


                    }


                }
                else if (itemScope.cloneInformation !== null) {
                    //This element was unstacked, so delete this element.
                    var foundOriginalTiles = getTilesForItem(itemScope.cloneInformation.originalItem);
                    foundOriginalTiles.removeClass("hover-enabled").removeClass("hover-disabled").addClass("dropped");
                    itemScope.destroy();
                }
                else {
                    revertDrop(itemScope);

                }


            };
            var finishDrop = function (_data, _itemScope, _itemIsStacking, _droppedTile, _foundTiles, _rasterEls) {
                var itemScope = _itemScope;
                var itemIsStacking = _itemIsStacking;
                var droppedTile = _droppedTile;
                var droppedSlot = droppedTile.data("slot-index");
                var foundTiles = _foundTiles;
                var rasterEls = _rasterEls;
                var data = _data;
                if (data.CODE === 0) {

                    //Reset the itemId on the tiles if we drag the element away.
                    //First remove the class
                    //var foundTiles = getTilesForItem(itemScope.getItemId());
                    foundTiles.removeClass("dropped");

                    foundTiles.each(function (_index, _item) {
                        var item = $(_item);
                        var items = JSON.parse(item.attr("data-itemids"));
                        if (items.length > 1) {
                            //We got stacked elements.
                            if (itemScope.isStacked === false) {
                                items.splice($.inArray(itemScope.getItemId(), items), 1);
                            }
                            else {
                                for (var i = 0; i < itemScope.stackedItemIds.length; i++) {
                                    items.splice($.inArray(itemScope.stackedItemIds[i], items), 1);
                                }
                            }
                            if (items.length === 0) {
                                //Reset to nothing in it.
                                items = [-1];
                                item.attr("data-templateid", -1);
                            }

                        }
                        else {
                            //Reset to nothing in it.
                            items = [-1];
                            item.attr("data-templateid", -1);
                        }

                        item.attr("data-itemids", JSON.stringify(items));
                    });


                    if (itemScope.isStacked === false) {
                        for (var i = 0; i < rasterEls.length; i++) {
                            var rasterItemIds = JSON.parse(rasterEls[i].attr("data-itemids"));

                            if (rasterItemIds.indexOf(-1) >= 0) {
                                rasterItemIds = [];
                                // rasterItemIds.splice($.inArray(-1, rasterItemIds), 1);
                            }
                            else {
                                //Item will be stacked.
                                itemIsStacking = true;
                            }
                            rasterItemIds.push(itemScope.getItemId());

                            rasterEls[i].attr("data-itemids", JSON.stringify(rasterItemIds));
                            rasterEls[i].attr("data-templateid", itemScope.getItemData().TEMPLATE);
                            rasterEls[i].removeClass("hover-enabled").removeClass("hover-disabled").addClass("dropped");
                        }
                    }
                    else {

                        for (var i = 0; i < rasterEls.length; i++) {
                            var rasterItemIds = JSON.parse(rasterEls[i].attr("data-itemids"));

                            if (rasterItemIds.indexOf(-1) >= 0) {
                                rasterItemIds = [];
                                // rasterItemIds.splice($.inArray(-1, rasterItemIds), 1);
                            }
                            else {
                                //Item will be stacked.
                                itemIsStacking = true;
                            }

                            for (var z = 0; z < itemScope.stackedItemIds.length; z++) {
                                rasterItemIds.push(itemScope.stackedItemIds[z]);
                            }


                            rasterEls[i].attr("data-itemids", JSON.stringify(rasterItemIds));
                            rasterEls[i].attr("data-templateid", itemScope.getItemData().TEMPLATE);
                            rasterEls[i].removeClass("hover-enabled").removeClass("hover-disabled").addClass("dropped");
                        }

                    }

                    if (itemScope.cloneInformation !== null) {
                        var foundOriginalTiles = getTilesForItem(itemScope.cloneInformation.originalItem);
                        foundOriginalTiles.removeClass("hover-enabled").removeClass("hover-disabled").addClass("dropped");
                        var unstackingItemScope = getItemScopeById(itemScope.cloneInformation.originalItem);
                        //Remove all stacks of the unstacked item scope and add them to the new one - we can just do it here, else we would get wrong persistent datas.
                        for (var i = 0; i < itemScope.stackedItemIds.length; i++) {
                            itemScope.stackedItemIdsInformation[itemScope.stackedItemIds[i]] = unstackingItemScope.stackedItemIdsInformation[itemScope.stackedItemIds[i]]
                            delete unstackingItemScope.stackedItemIdsInformation[itemScope.stackedItemIds[i]];
                        }
                        itemScope.cloneInformation = null;
                    }

                    if (itemIsStacking) {
                        //Remove this item instance and set the count of the already existing item there "+1"
                        //This index need to exists at all, and cant be null, else we couldn't drop.
                        var itemIds = JSON.parse(droppedTile.attr("data-itemids"));
                        var stackedItemId = itemIds[0];
                        var stackingItemScope = getItemScopeById(stackedItemId);

                        for (var key in itemScope.stackedItemIdsInformation) {
                            stackingItemScope.stackedItemIdsInformation[parseInt(key)] = itemScope.stackedItemIdsInformation[parseInt(key)];
                            //Remove the stack
                            delete itemScope.stackedItemIdsInformation[parseInt(key)];
                        }
                        stackingItemScope.stackedItemIds = itemIds;

                        if (!stackingItemScope.$$phase) {
                            stackingItemScope.$apply();
                        }

                        itemScope.$destroy();
                        itemScope.itemEl.remove();
                        $scope.calculateStorageWeight();


                    }
                    else {
                        //Just add this element now.
                        $(itemScope.itemEl).position({
                            of: droppedTile,
                            my: 'left top',
                            at: 'left top'
                        });
                        uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().ENABLE_ENTER, {});
                        itemScope.setSlot(droppedSlot);
                        itemScope.dropFinished($scope);
                        $scope.calculateStorageWeight();
                    }
                }
                else {
                    if (itemScope.cloneInformation !== null) {
                        //This element was unstacked, so delete this element.
                        itemScope.destroy();
                    }
                    else {
                        revertDrop(itemScope);

                    }
                    $scope.calculateStorageWeight();
                }


            };

            /**
             * @method
             * @param _itemId
             * @param _sourceStorage
             * @param _targetStorage
             * @param _sourceSlot
             * @param _targetSlot
             * @private
             */
            var moveItem = function (_itemId, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot) {
                return uiCommunicateSocketModel.STORAGE_MOVE(storageSocketURL, _itemId, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot);
            };
            /**
             * @method
             * @param _itemId
             * @param _storageId
             * @param _sourceSlot
             * @param _targetSlot
             * @private
             */
            var swapItem = function (_itemId, _storageId, _sourceSlot, _targetSlot) {
                return uiCommunicateSocketModel.STORAGE_SWAP_ITEM(storageSocketURL, _itemId, _storageId, _sourceSlot, _targetSlot);
            };

            /**
             * @method
             * @param [int] _itemIds
             * @param _storageId
             * @param _sourceSlot
             * @param _targetSlot
             * @private
             */
            var stackItem = function (_itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot) {
                return uiCommunicateSocketModel.STORAGE_STACK_ITEM(storageSocketURL, _itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot);
            };

            /**
             * ItemIds can be one or more items
             * @method
             * @param [int] _itemIds
             * @param _sourceStorage
             * @param _targetStorage
             * @param _sourceSlot
             * @param _targetSlot
             * @private
             */
            var unstackItem = function (_itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot) {
                return uiCommunicateSocketModel.STORAGE_UNSTACK_ITEM(storageSocketURL, _itemIds, _sourceStorage, _targetStorage, _sourceSlot, _targetSlot);
            };
            /**
             * Revert drop of item.
             * @method
             * @param {$scope} _draggedScope - The dragged item-scope.
             */
            var revertDrop = function (_draggedScope) {
                _draggedScope.revertDrag();
                //Place the item were it was before
                if ($scope.getStorageId() !== _draggedScope.getStorageId()) {
                    var oldStorage = angular.element($("storage[storage-id='" + _draggedScope.getStorageId() + "']")).isolateScope();
                    var revertingTiles = oldStorage.getTileRows();

                    oldStorage.getTilesForItem(_draggedScope.getItemId()).addClass("dropped");
                    revertingTiles.find("td.hover-enabled").removeClass("hover-enabled");
                    revertingTiles.find("td.hover-disabled").removeClass("hover-disabled");
                }


                getTilesForItem(_draggedScope.getItemId()).addClass("dropped");
                tileRows["page" + $scope.actualPage].find("td.hover-enabled").removeClass("hover-enabled");
                tileRows["page" + $scope.actualPage].find("td.hover-disabled").removeClass("hover-disabled");

            };


            /**
             * Called from item if item was dragged out of every storage and "dropped" - revert it.
             * @method
             * @param {$scope} _draggedScope - The itemScope.
             */
            $scope.itemDragStopped = function (_draggedScope) {
                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().ENABLE_ENTER, {});

                if (_draggedScope.dropped === false) {
                    //Just add the dropped attribute, if the tile was dragged outside the storage, else the dropitem / finishDrop will set this class.
                    getTilesForItem(_draggedScope.getItemId()).addClass("dropped");
                }

                //Remove at all the hover enabled and disabled
                tileRows["page" + $scope.actualPage].find("td.hover-enabled").removeClass("hover-enabled");
                tileRows["page" + $scope.actualPage].find("td.hover-disabled").removeClass("hover-disabled");
            };

            /**
             * Called if the item start his dragging mechanismn
             * @method
             * @param {$scope} _draggedScope
             */
            $scope.itemDragStart = function (_draggedScope) {
                //Bloody hack, if we ctrl+rightclick an item we show a separator-container, if an item is moved, check if this container still exists and remove it.
                if ($(".itemseparator-container").length > 0) {
                    $(".itemseparator-container").remove();
                }
                $scope.bringToFront(true);

                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().UI_BRING_TO_FRONT, uiCommunicate.createBroadcastData().UI_BRING_TO_FRONT($scope.uniqueId));

                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().DISABLE_ENTER, {});

                getTilesForItem(_draggedScope.getItemId()).removeClass("dropped");
            };


            /**
             * Checks if this storage needs to be set infront or not.
             * @event UI_BRING_TO_FRONT
             */
            $scope.$on(uiCommunicate.getBroadcastTypes().UI_BRING_TO_FRONT, function (_evt, _data) {

                if (_data.DATA.UNIQUE_ID !== $scope.uniqueId) {
                    $scope.bringToFront(false);
                }
                else {
                    $scope.bringToFront(true);
                }
            });

            /**
             * Called if an item was gathered / crafted, retrieve information and lodge in storage.
             * @event STORAGE_ADD_ITEM
             */
            $scope.$on(uiCommunicate.getBroadcastTypes().STORAGE_ADD_ITEM, function (_evt, _data) {

                if (_data.DATA.STORAGEID === $scope.getStorageId() && _data.DATA.ITEM !== null) {
                    var item = _data.DATA.ITEM;

                    addItem(item.ID).then(function (_scope) {
                        addItemToStorage(_scope, item);
                    });

                }

            });

            /**$scope.testFunction =function(_id)
             {
                var item = JSON.parse('{"IS_STACKED":true,"WIDTH":1,"WEIGHT":1,"NAME":"StackMeAgain","TEMPLATE":4,"SLOT":1,"IS_BANK":false,"ID":' + _id + ',"HEIGHT":1}');

                 addItem(item.ID).then(function(_scope)
                 {
                     addItemToStorage(_scope,item);
                 });
             }**/

            /**
             * Sets the z-index to 101 if it should be displayed.
             * @method
             * @param _front
             */
            $scope.bringToFront = function (_front) {
                if (_front) {
                    $scope.$element.css("z-index", 101);
                }
                else {
                    $scope.$element.css("z-index", 100);
                }
            };


            /**
             * Called if element hovers an tile.
             * Other hovered tiles are calculated init.
             * @event
             * @private
             * @param {event} _event
             * @param {Element} _ui - Inherits the actual dragged element
             */
            var hoverDropzone = function (_event, _ui) {

                var itemScope = getItemScope(_ui.draggable);
                var itemRasters = itemScope.hoveredRasters;

                tileRows["page" + $scope.actualPage].find("td.hover-enabled").removeClass("hover-enabled");
                tileRows["page" + $scope.actualPage].find("td.hover-disabled").removeClass("hover-disabled");


                var rowIndex = $(this).data("row-index");
                var colIndex = $(this).data("col-index");


                var smallestTop = rowIndex;
                var smallestLeft = colIndex;

                var rasterEls = [];
                var canDrop = true;
                var foundSmallerOne = false;
                for (var i = 0; i < itemRasters.length; i++) {


                    if (smallestTop > (rowIndex + itemRasters[i].top)) {
                        foundSmallerOne = true;
                        smallestTop = rowIndex + itemRasters[i].top;
                    }
                    if (smallestLeft > (colIndex + itemRasters[i].left)) {
                        foundSmallerOne = true;
                        smallestLeft = colIndex + itemRasters[i].left;
                    }

                    var rasterEl = tileRows["page" + $scope.actualPage].find("[data-row-index=" + (rowIndex + itemRasters[i].top) + "][data-col-index=" + (colIndex + itemRasters[i].left) + "]");
                    if (rasterEl === null || rasterEl === undefined || rasterEl.length <= 0) {
                        //Dragged out of corner.
                        rasterEls = [];
                        canDrop = false;
                        break;
                    }
                    else {
                        rasterEls.push(rasterEl);
                    }

                }
                if (foundSmallerOne) {
                    rasterEls.push(tileRows["page" + $scope.actualPage].find("[data-row-index=" + (smallestTop) + "][data-col-index=" + (smallestLeft) + "]"));
                }
                rasterEls.push($(this));


                if (droppable(itemScope, rasterEls)) {
                    //Run through our raster
                    for (var i = 0; i < itemRasters.length; i++) {


                        var actualTile = tileRows["page" + $scope.actualPage].find("[data-row-index=" + (rowIndex + itemRasters[i].top) + "][data-col-index=" + (colIndex + itemRasters[i].left) + "]");
                        //var actualTileItemIds = JSON.parse(actualTile.attr("data-itemids"));


                        actualTile.addClass("hover-enabled");

                        //tileRows.find("[data-row-index=" + (rowIndex + itemRasters[i].top) + "][data-col-index=" + (colIndex + itemRasters[i].left) + "]").css("opacity", "0.2");
                    }
                    var actualTile = $(this);
                    //var actualTileItemIds = JSON.parse(actualTile.attr("data-itemids"));
                    actualTile.addClass("hover-enabled");

                }
                else {
                    for (var i = 0; i < itemRasters.length; i++) {


                        var actualTile = tileRows["page" + $scope.actualPage].find("[data-row-index=" + (rowIndex + itemRasters[i].top) + "][data-col-index=" + (colIndex + itemRasters[i].left) + "]");
                        //var actualTileItemIds = JSON.parse(actualTile.attr("data-itemids"));


                        actualTile.addClass("hover-disabled");

                        //tileRows.find("[data-row-index=" + (rowIndex + itemRasters[i].top) + "][data-col-index=" + (colIndex + itemRasters[i].left) + "]").css("opacity", "0.2");
                    }
                    var actualTile = $(this);
                    //var actualTileItemIds = JSON.parse(actualTile.attr("data-itemids"));
                    actualTile.addClass("hover-disabled");

                }


            };

            /**
             * Called if ng-repeat is finished in the .HTML-Template with all tiles.
             * Add the droppable event of jQuery to each tile and instance items.
             * @event repeatFinshed
             */
            $scope.repeatFinished = function () {
                //Give our browser the time to finish the DOM-Render - 0 MS - haha, but executed after DOM was rendered.
                $timeout(function () {

                    var storagePages = jQuery(el).find("[data-id='storage']");
                    for (var i = 0; i < storagePages.length; i++) {
                        var page = $(storagePages[i]);
                        var pageNumber = parseInt(page.data("page"));
                        tiles["page" + pageNumber] = page.find("tr td");
                        tileRows["page" + pageNumber] = page.find("tr");

                        //Init every tile as a dropzone.
                        tiles["page" + pageNumber].droppable({
                            over: hoverDropzone,
                            tolerance: tolerance,
                            drop: dropItem,
                            out: function (event, ui) {

                            }
                        });

                        //Define our global dropzone, which just checks the "OUT-Event" , so we're leaving the storage and we need to remove our disabled or hovered state.
                        page.droppable({

                            tolerance: tolerance,

                            out: function (event, ui) {

                                tileRows["page" + pageNumber].find("td.hover-enabled").removeClass("hover-enabled");
                                tileRows["page" + pageNumber].find("td.hover-disabled").removeClass("hover-disabled");
                            }
                        });
                    }


                    //Instance our items now.
                    instanceItems();


                }, 0, false);

            };

            /**
             * Called after repeat-finished
             * Instance all items which are alrady stored.
             * @method
             * @private
             */
            var instanceItems = function instanceItems() {
                var slots = storage.SLOTS;

                for (var i = 0; i < slots.length; i++) {
                    var item = slots[i];
                    (function (_item) {
                        addItem(_item.ID).then(function (_scope) {
                            addItemToStorage(_scope, _item);
                        });
                    })(item);
                }
            };

            //Called on instanceItems function
            /// \todo maybe do this if we get something from server aswell... i dont know

            /**
             * Triggered from STORAGE_ADD_ITEM
             * @method
             * @param {number} _id
             * @return {promise|*|d.promise}
             */
            var addItem = function addItem(_id) {
                var deferred = $q.defer();

                var instanceId = createItemInstanceId;
                createItemInstanceId += 1;
                var viewInitParam = {ADD_ITEM: true, INSTANCE_ID: instanceId};
                //Stringify it, cause we pass this attributes via HTML... bad alternative but need to be
                viewInitParam = "'" + JSON.stringify(viewInitParam).toString() + "'";
                var controlEle = $("<item init-data=" + viewInitParam + " item-id='" + _id + "' storage-id='" + $scope.getStorageId() + "' class=\"draggable\" style=\"z-index:1000;position:absolute;\" lvl-draggable=\"true\"  />");
                $(jQuery(el).find("[data-id='storage']")[0]).append(controlEle);
                $compile(controlEle)($scope);
                createItemInstanceCallbacks[instanceId] = deferred;

                return deferred.promise;
            };

            /**
             * Copies an actual Item with its ID and template.
             * @method
             * @param {Number} _id
             * @param {Number} _template
             * @returns {promise|*|d.promise}
             */
            $scope.copyItem = function copyItem(_id, _template) {
                var deferred = $q.defer();

                var instanceId = createItemInstanceId;
                createItemInstanceId += 1;
                var viewInitParam = {TEMPLATE: _template, INSTANCE_ID: instanceId};
                //Stringify it, cause we pass this attributes via HTML... bad alternative but need to be
                viewInitParam = "'" + JSON.stringify(viewInitParam).toString() + "'";
                var controlEle = $("<item init-data=" + viewInitParam + " item-id='" + _id + "' storage-id='" + $scope.getStorageId() + "' class=\"draggable\" style=\"z-index:1000;position:absolute;\" lvl-draggable=\"true\"  />");
                $(jQuery(el).find("[data-id='storage']")[0]).append(controlEle);
                $compile(controlEle)($scope);
                createItemInstanceCallbacks[instanceId] = deferred;

                return deferred.promise;
            };


            /**
             * Calculate the storage-weight with all items in it.
             * @method
             */
            $scope.calculateStorageWeight = function calculateStorageWeight() {
                var actualWeight = 0.0;
                $scope.$element.find("item[storage-id=" + $scope.getStorageId() + "]").each(function (index, item) {
                    var itemScope = getItemScopeById($(item).attr("item-id"));
                    for (var key in itemScope.stackedItemIdsInformation) {
                        actualWeight += itemScope.stackedItemIdsInformation[parseInt(key)].WEIGHT;
                    }
                });
                $scope.actualWeight = actualWeight;
            };
            /**
             * Called from item-directive after item was created.
             * Check if the instance is an STARTUP-instance, or if the item was copyed / created after, if yes resolve the promise.
             * @param {$scope} _scope
             */
            $scope.itemInstanced = function itemInstanced(_scope, _data) {

                if (_data.TEMPLATE !== null && _data.TEMPLATE !== undefined) {
                    var instanceId = _data.INSTANCE_ID;
                    var item = uiDB.getItem(instanceId);

                    createItemInstanceCallbacks[instanceId].resolve(_scope, item);
                    delete createItemInstanceCallbacks[instanceId];


                }
                if (_data.ADD_ITEM !== null && _data.ADD_ITEM !== undefined) {
                    var instanceId = _data.INSTANCE_ID;

                    createItemInstanceCallbacks[instanceId].resolve(_scope);
                    delete createItemInstanceCallbacks[instanceId];
                }
            };
            /**
             * Called by instanceItems or if a new item was gathered/crafted.
             * @method
             * @param {$scope} _scope
             * @param {*} _item
             * @private
             */
            var addItemToStorage = function (_scope, _item) {
                var item = _item;
                ///\todo pass right item here.
                _scope.setItemData(item).then(function (_scope) {
                    var itemScope = _scope;


                    /// \todo set item on stacking rightly.
                    itemScope.setSlot(_scope.itemData.SLOT);

                    var itemRasters = itemScope.hoveredRasters;

                    //Divide slot with height of the scope, so we get our page.
                    //Slot 48/50 = Page 0
                    //Slot 50/50 = Page 1
                    //Cause we start on index 0
                    var page = Math.floor(_scope.itemData.SLOT / ($scope.width * $scope.height));
                    jQuery(el).find("[data-id='storage'][data-page='" + page + "']").append(itemScope.itemEl);
                    var tileEl = tileRows["page" + page].find("[data-slot-index='" + _scope.itemData.SLOT + "']");
                    var rowIndex = $(tileEl).data("row-index");
                    var colIndex = $(tileEl).data("col-index");

                    var smallestTop = rowIndex;
                    var smallestLeft = colIndex;

                    var rasterEls = [];
                    var canDrop = true;
                    var foundSmallerOne = false;
                    for (var i = 0; i < itemRasters.length; i++) {
                        var topCount = itemRasters[i].top;
                        var leftCount = itemRasters[i].left;


                        if (smallestTop > (rowIndex + itemRasters[i].top)) {
                            foundSmallerOne = true;
                            smallestTop = rowIndex + itemRasters[i].top;
                        }
                        if (smallestLeft > (colIndex + itemRasters[i].left)) {
                            foundSmallerOne = true;
                            smallestLeft = colIndex + itemRasters[i].left;
                        }

                        var rasterEl = tileRows["page" + page].find("[data-row-index=" + (rowIndex + itemRasters[i].top) + "][data-col-index=" + (colIndex + itemRasters[i].left) + "]");
                        if (rasterEl === null || rasterEl === undefined || rasterEl.length <= 0) {
                            //Dragged out of corner.
                            rasterEls = [];
                            canDrop = false;
                            break;
                        }
                        else {
                            rasterEls.push(rasterEl);
                        }

                    }
                    if (foundSmallerOne) {
                        rasterEls.push(tileRows["page" + page].find("[data-row-index=" + (smallestTop) + "][data-col-index=" + (smallestLeft) + "]"));
                    }
                    rasterEls.push(tileEl);


                    itemScope.dropped = true;
                    if (canDrop === true && droppable(itemScope, rasterEls) === true) {
                        var itemIsStacking = false;
                        //Reset the itemId on the tiles if we drag the element away.
                        //First remove the class
                        getTilesForItem(itemScope.getItemId()).removeClass("dropped");
                        getTilesForItem(itemScope.getItemId()).attr("data-itemids", "[-1]").attr("data-templateid", -1);


                        for (var i = 0; i < rasterEls.length; i++) {

                            var rasterItemIds = JSON.parse(rasterEls[i].attr("data-itemids"));

                            if (rasterItemIds.indexOf(-1) >= 0) {
                                rasterItemIds = [];
                                // rasterItemIds.splice($.inArray(-1, rasterItemIds), 1);
                            }
                            else {
                                itemIsStacking = true;
                            }


                            rasterItemIds.push(itemScope.getItemId());

                            rasterEls[i].attr("data-itemids", JSON.stringify(rasterItemIds));
                            rasterEls[i].attr("data-templateid", itemScope.getItemData().TEMPLATE);
                            rasterEls[i].addClass("dropped");

                        }

                        var droppedTile = tileRows["page" + page].find("[data-row-index=" + (smallestTop) + "][data-col-index=" + (smallestLeft) + "]");
                        if (itemIsStacking) {
                            //Remove this item instance and set the count of the already existing item there "+1"


                            //This index need to exists at all, and cant be null, else we couldn't drop.
                            var itemIds = JSON.parse(droppedTile.attr("data-itemids"));
                            var stackedItemId = itemIds[0];
                            var stackingItemScope = getItemScopeById(stackedItemId);

                            for (var key in itemScope.stackedItemIdsInformation) {
                                stackingItemScope.stackedItemIdsInformation[parseInt(key)] = itemScope.stackedItemIdsInformation[parseInt(key)];
                                delete itemScope.stackedItemIdsInformation[parseInt(key)];
                            }
                            stackingItemScope.stackedItemIds = itemIds;

                            //$timeout(function () {

                            itemScope.$destroy();
                            itemScope.itemEl.remove();
                            $scope.calculateStorageWeight();
                            //}, 50);

                        }
                        else {
                            //Just add this element now.
                            $(itemScope.itemEl).position({
                                of: droppedTile,
                                my: 'left top',
                                at: 'left top'
                            });
                            uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().ENABLE_ENTER, {});

                            itemScope.dropFinished($scope);
                            $scope.calculateStorageWeight();
                        }


                    }
                })
            };


            /**
             * Show or hide this storage
             * @method
             * @param {boolean} _showOrHide
             * @private
             */
            var toggle = function toggle(_showOrHide) {
                if (_showOrHide) {
                    $scope.$element.removeClass("hide");
                    $scope.$element.addClass("show");
                    $scope.bringToFront(true);
                    uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().UI_BRING_TO_FRONT, uiCommunicate.createBroadcastData().UI_BRING_TO_FRONT($scope.uniqueId));

                }
                else {

                    $scope.$element.addClass("hide");
                    $scope.$element.removeClass("show");
                }

            };

            /**
             * Called if an item was dragged from one bag into another. (Called from new storage so);
             * @event itemRemoved
             * @param _scope
             */
            $scope.itemRemoved = function (_itemScope) {

                //If an item was moved to another storage, we won't find anything here so lets skip if we don't find tiles
                if (getTilesForItem(_itemScope.getItemId()).length > 0) {
                    var oldItemIds = JSON.parse(getTilesForItem(_itemScope.getItemId()).attr("data-itemids"));
                    if (_itemScope.stackedItemIds.length === oldItemIds.length) {
                        getTilesForItem(_itemScope.getItemId()).removeClass("dropped").removeClass("hover-enabled").removeClass("hover-disabled");
                        getTilesForItem(_itemScope.getItemId()).attr("data-itemids", "[-1]").attr("data-templateid", -1);
                    }
                    else {
                        //The itemRemoved is called before the finishDrop event, so the stackedItemIds are still on both items.
                        //Cause we just unstack here, we need to match the oldItemIds with the movedItemIds and get the still remaining items on this slot

                        var movedItemIds = _itemScope.stackedItemIds;
                        for (var i = 0; i < movedItemIds.length; i++) {
                            oldItemIds.splice($.inArray(movedItemIds[i], oldItemIds), 1);
                        }
                        getTilesForItem(_itemScope.getItemId()).removeClass("hover-enabled").removeClass("hover-disabled");
                        getTilesForItem(_itemScope.getItemId()).attr("data-itemids", JSON.stringify(oldItemIds));
                    }

                    $scope.calculateStorageWeight();
                }
            };

            $scope.changePage = function changePage(_page) {
                $scope.actualPage = _page;
            };
            /**
             * Called on broadcast.
             * @event toggleStorage
             */
            $scope.$on(uiCommunicate.getBroadcastTypes().STORAGE_TOGGLE, function (_evt, _data) {

                if (parseInt(_data.DATA.STORAGEID) === $scope.getStorageId()) {


                    uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().UI_BRING_TO_FRONT, uiCommunicate.createBroadcastData().UI_BRING_TO_FRONT($scope.uniqueId));

                    var visible = _data.DATA.VISIBLE;
                    toggle(visible);
                    //ls.logINF("Storage - $on.toggleStorage - " + visible)
                }
            });

            /**
             * Show or hide this storage.
             * @method
             * @param {boolean} _showOrHide
             */
            $scope.toggle = function (_showOrHide) {
                toggle(_showOrHide);
            };

            /**
             * Called onclick by minimize
             * @event toggleStorage
             */
            $scope.toggleStorage = function () {
                toggle(false);
                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().TASKBAR_TOGGLE_STORAGE, uiCommunicate.createBroadcastData().TASKBAR_TOGGLE_STORAGE($scope.getStorageId(), false));
            };


            //Used by item directive
            /**
             * Called by item on startup to get the right instanced storage-scope.
             * @method
             * @returns {$scope}
             */
            this.getScope = function () {
                return $scope;
            };
            //Hide ourself on startup.
            toggle(false);


            //Tell our parent-storage controller we're finished with pre-init.
            $scope.storageInit({_scope: $scope});

        }],
        link: function (scope, ele, attrs) {

            var startDragOffset = {w: 0, h: 0};
            var mouseUp = function () {
                uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().ENABLE_ENTER, {});
                window.removeEventListener('mousemove', divMove, true);

            };
            var mouseDown = function (e) {
                if (e.originalEvent === undefined) {
                    return;
                }
                var target = scope.$element[0];
                startDragOffset = {
                    w: e.clientX - parseInt(scope.$element.offset().left),
                    h: e.clientY - parseInt(scope.$element.offset().top)
                };

                // @todo bring to front

                var clickedEl = $(e.originalEvent.toElement);

                var tagName = clickedEl.prop("tagName");
                if (tagName === "STORAGE" || clickedEl.data("id") === "storageHolder") {

                    uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().DISABLE_ENTER, {});
                    uiCommunicate.broadcast(uiCommunicate.getBroadcastTypes().UI_BRING_TO_FRONT, uiCommunicate.createBroadcastData().UI_BRING_TO_FRONT(scope.uniqueId));
                    window.addEventListener('mousemove', divMove, true);
                }


            };


            var divMove = function (e) {
                var div = scope.$element[0];
                div.style.position = 'absolute';
                div.style.left = (e.clientX - startDragOffset["w"]) + "px";
                div.style.top = (e.clientY - startDragOffset["h"]) + "px";
            };


            scope.$element.mousedown(mouseDown);
            window.addEventListener('mouseup', mouseUp, false);
        }


    }
}
