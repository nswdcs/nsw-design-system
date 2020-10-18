import { uniqueId } from '../../global/scripts/helpers/utilities'

class Tabs {
  constructor(element, showTab) {
    this.tablistClass = '.nsw-tabs__list'
    this.tablistItemClass = '.nsw-tabs__list-item'
    this.tablistLinkClass = '.nsw-tabs__link'

    this.tab = element
    this.showTab = showTab
    this.tabList = element.querySelector(this.tablistClass)
    this.tabItems = this.tabList.querySelectorAll(this.tablistItemClass)
    this.allowedKeys = [35, 36, 37, 39, 40]
    this.tabLinks = []
    this.tabPanel = []
    this.selectedTab = null
    this.clickTabEvent = (e) => this.clickTab(e)
    this.arrowKeysEvent = (e) => this.arrowKeys(e)
  }

  init() {
    this.setUpDom()
    this.controls()
    this.setInitalTab()
  }

  setUpDom() {
    this.tab.classList.add('is-ready')
    this.tabList.setAttribute('role', 'tablist')
    this.tabItems.forEach((item) => {
      const itemElem = item
      const itemLink = item.querySelector(this.tablistLinkClass)
      const panel = this.tab.querySelector(itemLink.hash)
      const uID = uniqueId('tab')

      itemElem.setAttribute('role', 'presentation')
      this.enhanceTabLink(itemLink, uID)
      this.enhanceTabPanel(panel, uID)
    })
  }

  enhanceTabLink(link, id) {
    link.setAttribute('role', 'tab')
    link.setAttribute('id', id)
    link.setAttribute('aria-selected', false)
    link.setAttribute('tabindex', '-1')
    this.tabLinks.push(link)
  }

  enhanceTabPanel(panel, id) {
    const panelElem = panel
    panelElem.setAttribute('role', 'tabpanel')
    panelElem.setAttribute('role', 'tabpanel')
    panelElem.setAttribute('aria-labelledBy', id)
    panelElem.setAttribute('tabindex', '0')
    panelElem.hidden = true
    this.tabPanel.push(panelElem)
  }

  setInitalTab() {
    const {
      tabItems, tabLinks, tabPanel, showTab,
    } = this
    const index = (showTab === undefined) ? 0 : showTab
    const selectedLink = tabLinks[index]
    tabItems[index].classList.add('is-selected')
    selectedLink.removeAttribute('tabindex')
    selectedLink.setAttribute('aria-selected', true)
    tabPanel[index].hidden = false
    this.selectedTab = selectedLink
  }

  clickTab(e) {
    e.preventDefault()
    this.switchTabs(e.currentTarget)
  }

  switchTabs(elem) {
    const clickedTab = elem
    if (clickedTab !== this.selectedTab) {
      clickedTab.focus()
      clickedTab.removeAttribute('tabindex')
      clickedTab.setAttribute('aria-selected', true)
      this.selectedTab.setAttribute('aria-selected', false)
      this.selectedTab.setAttribute('tabindex', '-1')
      const clickedTabIndex = this.tabLinks.indexOf(clickedTab)
      const selectedTabIndex = this.tabLinks.indexOf(this.selectedTab)
      this.tabItems[clickedTabIndex].classList.add('is-selected')
      this.tabItems[selectedTabIndex].classList.remove('is-selected')
      this.tabPanel[clickedTabIndex].hidden = false
      this.tabPanel[selectedTabIndex].hidden = true
      this.selectedTab = clickedTab
    }
  }

  arrowKeys({ which }) {
    const linkLength = this.tabLinks.length - 1
    let index = this.tabLinks.indexOf(this.selectedTab)
    let down = false

    if (this.allowedKeys.includes(which)) {
      switch (which) {
        case 35:
          index = linkLength
          break
        case 36:
          index = 0
          break
        case 37:
          index = (index === 0) ? linkLength : index -= 1
          break
        case 39:
          index = (index === linkLength) ? 0 : index += 1
          break
        case 40:
          down = true
          break
        default:
          break
      }

      if (down) {
        this.tabPanel[index].focus()
      } else {
        this.switchTabs(this.tabLinks[index])
      }
    }
  }

  controls() {
    this.tabLinks.forEach((link) => {
      link.addEventListener('click', this.clickTabEvent, false)
      link.addEventListener('keydown', this.arrowKeysEvent, false)
    })
  }
}

export default Tabs
