import { Component, h, Host, ComponentInterface, Method, State, Prop, Element } from '@stencil/core';
import { IonicSelectableComponent } from '../ionic-selectable/ionic-selectable.component';

/**
 * @internal
 */
@Component({
  tag: 'ionic-selectable-modal',
  styleUrls: {
    ios: 'ionic-selectable-modal.ios.component.scss',
    md: 'ionic-selectable-modal.md.component.scss'
  },
  scoped: true
})
export class IonicSelectableModalComponent implements ComponentInterface {
  @Element() private element!: HTMLIonicSelectableModalElement;
  private selectableComponent: IonicSelectableComponent;

  @State() private toggleUpdate: boolean = false;

  public infiniteScrollElement: HTMLIonInfiniteScrollElement;

  public virtualScrollElement: HTMLIonVirtualScrollElement;

  /**
   * Rerender the component
   */
  @Method()
  public async update(): Promise<void> {
    this.toggleUpdate = !this.toggleUpdate;
  }

  public connectedCallback(): void {
    const modalElement = document.querySelector('ion-modal');
    this.selectableComponent = modalElement.componentProps.selectableComponent;
    this.selectableComponent.selectableModalComponent = this;
  }

  public componentDidLoad(): void {
    this.infiniteScrollElement = this.element.querySelector('ion-infinite-scroll');
    this.virtualScrollElement = this.element.querySelector('ion-virtual-scroll');
  }

  private renderItem(item: any): any {
    return (
      <ion-item button={true} onClick={(): void => this.selectableComponent.selectItem(item)}>
        <ion-label>{this.selectableComponent.getItemText(item)}</ion-label>
        <ion-icon
          name={this.selectableComponent.isItemSelected(item) ? 'checkmark-circle' : 'radio-button-off'}
          size="small"
          slot={this.selectableComponent.itemIconSlot}
        />
      </ion-item>
    );
  }

  private renderHeader(header: any): any {
    return (
      <ion-item-divider color={this.selectableComponent.headerColor}>
        {/* Need ion-label for text ellipsis. */}
        <ion-label>{header}</ion-label>
      </ion-item-divider>
    );
  }

  public render(): void {
    return (
      <Host>
        <ion-header>
          <ion-toolbar>
            <ion-title>{this.selectableComponent.titleText}</ion-title>
            <ion-buttons slot={this.selectableComponent.closeButtonSlot}>
              <ion-button onClick={(): void => this.selectableComponent.closeModal()}>
                {this.selectableComponent.closeButtonText}
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
          {this.selectableComponent.canSearch /* || selectComponent.messageTemplate */ && (
            <ion-toolbar>
              <ion-searchbar
                value={this.selectableComponent.searchText}
                placeholder={this.selectableComponent.searchPlaceholder}
                debounce={this.selectableComponent.searchDebounce}
                cancelButtonIcon={this.selectableComponent.searchCancelButtonIcon}
                cancelButtonText={this.selectableComponent.searchCancelButtonText}
                clearIcon={this.selectableComponent.searchClearIcon}
                inputmode={this.selectableComponent.searchInputmode}
                searchIcon={this.selectableComponent.searchIcon}
                showCancelButton={this.selectableComponent.searchShowCancelButton}
                onIonChange={(event): void => this.selectableComponent.onSearchbarValueChanged(event)}
              ></ion-searchbar>
            </ion-toolbar>
          )}
        </ion-header>
        <ion-content>
          {!this.selectableComponent.hasVirtualScroll && this.selectableComponent.hasFilteredItems && (
            <ion-list>
              {this.selectableComponent.filteredGroups.map((group) => {
                return (
                  <ion-item-group>
                    {this.selectableComponent.hasGroups && (
                      <ion-item-divider color={this.selectableComponent.groupColor}>
                        {/* Need ion-label for text ellipsis. */}
                        <ion-label>{group.text}</ion-label>
                      </ion-item-divider>
                    )}
                    {group.items.map((item) => this.renderItem(item))}
                  </ion-item-group>
                );
              })}
            </ion-list>
          )}
          {this.selectableComponent.hasVirtualScroll && this.selectableComponent.hasFilteredItems && (
            <ion-virtual-scroll
              items={this.selectableComponent.filteredGroups[0].items}
              approxHeaderHeight={this.selectableComponent.virtualScrollApproxHeaderHeight}
              approxItemHeight={this.selectableComponent.virtualScrollApproxItemHeight}
              renderItem={(item): void => this.renderItem(item)}
              renderHeader={(header): void => this.renderHeader(header)}
              headerFn={this.selectableComponent.virtualScrollHeaderFn}
            ></ion-virtual-scroll>
          )}
          {this.selectableComponent.hasInfiniteScroll && (
            <ion-infinite-scroll
              threshold={this.selectableComponent.infiniteScrollThreshold}
              onIonInfinite={(): void => this.selectableComponent.getMoreItems()}
            >
              <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>
          )}
        </ion-content>
        {this.selectableComponent.footerButtonsCount /* && selectComponent.footerTemplate */ && (
          <ion-footer>
            <ion-toolbar /* *ngIf="!selectComponent.footerTemplate" */>
              <ion-row>
                {this.selectableComponent.canClear && (
                  <ion-col>
                    <ion-button
                      onClick={(): void => this.selectableComponent.clearItems()}
                      disabled={!(this.selectableComponent.selectedItems.length > 0)}
                      expand="full"
                    >
                      {this.selectableComponent.clearButtonText}
                    </ion-button>
                  </ion-col>
                )}
                {this.selectableComponent.canAddItem && (
                  <ion-col>
                    <ion-button onClick={(): void => this.selectableComponent.addItemClick()} expand="full">
                      {this.selectableComponent.addButtonText}
                    </ion-button>
                  </ion-col>
                )}
                {(this.selectableComponent.isMultiple ||
                  this.selectableComponent.hasConfirmButton ||
                  this.selectableComponent.canClear) && (
                  <ion-col>
                    <ion-button
                      onClick={(): void => this.selectableComponent.confirmSelection()}
                      disabled={!this.selectableComponent.isConfirmButtonEnabled}
                      expand="full"
                    >
                      {this.selectableComponent.confirmButtonText}
                    </ion-button>
                  </ion-col>
                )}
              </ion-row>
            </ion-toolbar>
          </ion-footer>
        )}
      </Host>
    );
  }
}