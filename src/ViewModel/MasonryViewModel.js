import { NOT_FOUND } from "../utils/value";
import isFunction from "../vendors/isFunction";

class MasonryViewModel {
  constructor({dataViewModel, node, itemCache}) {
    this.dataViewModel = dataViewModel;
    this.masonry = node;
    this.itemCache = itemCache;

    this.loadMoreTopCallback = undefined;
    this.loadMoreBottomCallback = undefined;

    this.scrollToSpecialItem = this.scrollToSpecialItem.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onUpdateItem = this.onUpdateItem.bind(this);
  }

  clear() {
    if (this.itemCache) {
      this.itemCache.clear();
    }
  }

  onDataChanged = (index: number, item: Object, senderId?: string) => {
    if (this.masonry &&
      this.masonry.current &&
      isFunction(this.masonry.current.reRender)) {
      if(senderId && senderId !== this.getRefId) {
        const data = this.dataViewModel.getDataList;
        const newItemPos = parseInt(index) === 0 ?
          0 :
          this.itemCache.getPosition(data[index - 1].itemId) + this.itemCache.getHeight(data[index - 1].itemId);

        this.itemCache.updateIndexMap(index - 1, data);
        this.itemCache.updateItemOnMap(
          item.itemId,
          data.indexOf(item),
          this.itemCache.defaultHeight,
          newItemPos,
          false);
        this.itemCache.updateItemsMap(index - 1, data.length);

        this.masonry.current.updateCacheFromOtherViewModel(index, item);
        this.masonry.current.reRender();
        // add item cache and children on view;
      }
    }
  };

  onLoadMoreTop(fn) {
    if (typeof fn === 'function') {
      this.loadMoreTopCallback = fn;
    }
  }

  onLoadMoreBottom(fn) {
    if (typeof fn === 'function') {
      this.loadMoreBottomCallback = fn;
    }
  }

  scrollToSpecialItem(itemId) {
    if (this.masonry &&
      this.masonry.current) {
      if (!this.itemCache.hasItem(itemId)) {
        // Send a notification to outside.
        console.log('Dont have this item');
      } else {
        this.masonry.current.scrollToSpecialItem(itemId);
      }
    }
  }

  scrollToTop() {
    if (this.masonry &&
      this.masonry.current) {
      this.masonry.current.scrollToTop();
    }
  }

  scrollToBottom() {
    if (this.masonry &&
      this.masonry.current) {
      this.masonry.current.scrollToBottom();
    }
  }

  onRemoveItem(itemId) {
    if (
      this.masonry &&
      this.masonry.current
    ) {
      this.masonry.current.onRemoveItem(itemId);
      this.masonry.current.reRender();
    }
  }

  onAddItem(index, item) {
    if (
      this.masonry &&
      this.masonry.current &&
      !this.isIdAlready(item.itemId)
    ) {
      this.masonry.current.onAddItem(index, item);
      this.masonry.current.reRender();
    }
  }

  onUpdateItem(itemId, item) {
    if (this.masonry &&
      this.masonry.current &&
      this.isIdAlready(itemId)) {
      const itemIndex = this.masonry.current.itemCache.getIndex(itemId);
      if (itemIndex !== NOT_FOUND) {
        this.getDataList[itemIndex] = item;
        this.masonry.current.reRender();
      }
    }
  }

  isIdAlready(id: string): boolean {
    this.dataViewModel._isIdAlready(id);
  };

  addTop(item) {
    this.onAddItem(0, item);
  }

  addBottom(item) {
    this.onAddItem(this.getDataList.length, item);
  }

  insertItem(index: number, item) {
    const data = this.dataViewModel.getDataList;
    const newItemPos = parseInt(index) === 0 ?
      0 :
      this.itemCache.getPosition(data[index - 1].itemId) + this.itemCache.getHeight(data[index - 1].itemId);

    this.dataViewModel.insertItem(index, item, this.getRefId);

    this.itemCache.updateIndexMap(index - 1, data);
    this.itemCache.updateItemOnMap(
      item.itemId,
      data.indexOf(item),
      this.itemCache.defaultHeight,
      newItemPos,
      false);
    this.itemCache.updateItemsMap(index - 1, data.length);
  }

  deleteItem(itemId: string, deleteCount: number = 1) {
    const itemIndex = this.itemCache.getIndex(itemId);
    this.dataViewModel.deleteItem(itemIndex, deleteCount);
    this.itemCache.deleteItem(itemIndex, itemId, this.dataViewModel.getDataList);
  }

  updateData(data) {
    if (this.masonry &&
      this.masonry.current) {
      this.clear();
      this.setData(data);
      this.masonry.current.initialize();
      this.masonry.current.reRender();
    }
  }

  appendStyle(el, animationNames) {
    if (this.masonry &&
      this.masonry.current) {
      this.masonry.current.appendStyle(el, animationNames);
    }
  }

  removeStyle(el, animationNames) {
    if (this.masonry &&
      this.masonry.current) {
      this.masonry.current.removeStyle(el, animationNames);
    }
  }

  shouldLoadMoreTop() {
    console.log('============load top===============');
  }

  shouldLoadMoreBottom() {
    console.log('============load bottom===============');
  }

  // region GET-SET
  get getRefId() {
    if (
      this.masonry &&
      this.masonry.current &&
      this.masonry.current.props) {
      return this.masonry.current.props.id;
    }
    return null;
  }

  get getDataList() {
    return this.dataViewModel.getDataList;
  }

  get getMasonry() {
    return this.masonry;
  }

  get getItemCache() {
    return this.itemCache;
  }

  get getLoadMoreTopCallBack() {
    return this.loadMoreTopCallback;
  }

  get getLoadMoreBottomCallBack() {
    return this.loadMoreBottomCallback;
  }

  setData(data) {
    this.dataViewModel = [];
    this.dataViewModel = data;
  }

  setMasonry(masonry) {
    this.masonry = masonry;
  }

  // endregion
}

export default MasonryViewModel;