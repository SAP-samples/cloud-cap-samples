/* global QUnit */
/* eslint no-unused-vars: 0 */
sap.ui.define(['sap/ui/test/opaQunit'], function (opaTest) {
  'use strict'

  var Journey = {
    start: function () {
      QUnit.module('Sample journey')
      opaTest('#000: Start', function (Given, When, Then) {
        Given.iResetTestData().and.iStartMyApp('', { 'sap-language': 'EN' })
      })
      return Journey
    },

    test: function () {
      opaTest(
        '#1: ListReport: Check List Report Page loads',
        function (Given, When, Then) {
          Then.onTheMainPage.iSeeThisPage()
        }
      )

      opaTest(
        '#2: Object Page: Check Object Page loads',
        function (Given, When, Then) {
          When.onTheMainPage.onTable().iPressRow({ Travel: '4,133' })
          Then.onTheDetailPage.iSeeThisPage()

          When.iNavigateBack()
          Then.onTheMainPage.iSeeThisPage()
        }
      )

      opaTest('#3: List report: Create travel', function (Given, When, Then) {
        Then.onTheMainPage.iSeeThisPage()
        Then.onTheMainPage.onTable().iCheckAction('Create', { enabled: true })

        // Click on Create button
        When.onTheMainPage.onTable().iExecuteAction('Create')
        Then.onTheDetailPage.iSeeObjectPageInEditMode()
        When.onTheDetailPage.iOpenSectionWithTitle('General Information')

        // Value help Agency ID
        When.onTheDetailPage
          .onForm({ section: 'Travel', fieldGroup: 'TravelData' })
          .iOpenValueHelp({ property: 'to_Agency_AgencyID' })
        When.onTheDetailPage
          .onValueHelpDialog()
          .iSelectRows({ 0: '070006' })
          .and.iConfirm()

        // Value help Customer ID
        When.onTheDetailPage
          .onForm({ section: 'Travel', fieldGroup: 'TravelData' })
          .iOpenValueHelp({ property: 'to_Customer_CustomerID' })
        When.onTheDetailPage
          .onValueHelpDialog()
          .iSelectRows({ 0: '000001' })
          .and.iConfirm()

        // Starting date
        When.onTheDetailPage
          .onForm({ section: 'Travel', fieldGroup: 'DateData' })
          .iChangeField({ property: 'BeginDate' }, 'Jan 1, 2023')

        // End date
        When.onTheDetailPage
          .onForm({ section: 'Travel', fieldGroup: 'DateData' })
          .iChangeField({ property: 'EndDate' }, 'Dec 31, 2024')

        // Booking fee
        When.onTheDetailPage
          .onForm({ section: 'Travel', fieldGroup: 'PriceData' })
          .iChangeField({ property: 'BookingFee' }, '50.00')

        // Description
        When.onTheDetailPage
          .onForm({ section: 'Travel', fieldGroup: 'TravelData' })
          .iChangeField({ property: 'Description' }, 'Travel for deletion')

        // Save all
        Then.onTheDetailPage.onFooter().iCheckDraftStateSaved()
        When.onTheDetailPage.onFooter().iExecuteSave()
        Then.onTheDetailPage.iSeeThisPage().and.iSeeObjectPageInDisplayMode()
        When.iNavigateBack()
      })

      opaTest('#4: List report: Delete travel', function (Given, When, Then) {
        Then.onTheMainPage.iSeeThisPage()

        Then.onTheMainPage
          .onTable()
          .iCheckDelete({ visible: true, enabled: false })

        // select row to be deleted
        Given.onTheMainPage
          .onTable()
          .iSelectRows({ Travel: 'Travel for deletion' })

        Then.onTheMainPage
          .onTable()
          .iCheckDelete({ visible: true, enabled: true })
        When.onTheMainPage
          .onTable()
          .iExecuteDelete()
          .and.when.onDialog()
          .iConfirm()
        Then.onTheMainPage
          .onTable()
          .iCheckDelete({ visible: true, enabled: false })
      })

      opaTest(
        '#5: List report: Check actions (Accept, Reject)',
        function (Given, When, Then) {
          Then.onTheMainPage.iSeeThisPage()

          // Check that bound action is inactive without selection
          Then.onTheMainPage
            .onTable()
            .iCheckAction(
              { service: 'TravelService', action: 'acceptTravel' },
              { visible: true, enabled: false }
            )

          // select first row
          Given.onTheMainPage.onTable().iSelectRows({ Travel: '4,132' })

          // Check that bound action is now active after selection
          Then.onTheMainPage
            .onTable()
            .iCheckAction(
              { service: 'TravelService', action: 'acceptTravel' },
              { visible: true, enabled: true }
            )

          // check that "Travel status" is Open
          Then.onTheMainPage
            .onTable()
            .iCheckRows({ Travel: '4,132', 'Travel Status': 'Open' }, 1)

          // trigger action
          When.onTheMainPage.onTable().iExecuteAction({
            service: 'TravelService',
            action: 'acceptTravel'
          })

          // check that "Travel status" is now Accepted
          Then.onTheMainPage
            .onTable()
            .iCheckRows({ Travel: '4,132', 'Travel Status': 'Accepted' }, 1)

          // unselect first row
          Given.onTheMainPage.onTable().iSelectRows({ Travel: '4,132' })

          // select 2nd row
          Given.onTheMainPage.onTable().iSelectRows({ Travel: '4,131' })

          // check that "Travel status" is Open
          Then.onTheMainPage
            .onTable()
            .iCheckRows({ Travel: '4,131', 'Travel Status': 'Open' }, 1)

          // trigger action
          When.onTheMainPage.onTable().iExecuteAction({
            service: 'TravelService',
            action: 'rejectTravel'
          })

          // check that "Travel status" is Open
          Then.onTheMainPage
            .onTable()
            .iCheckRows({ Travel: '4,131', 'Travel Status': 'Canceled' }, 1)

          // unselect 2nd row
          Given.onTheMainPage.onTable().iSelectRows({ Travel: '4,131' })

          Then.onTheMainPage.iSeeThisPage()
        }
      )

      opaTest(
        '#6: Object Page: Check details for accepted travel',
        function (Given, When, Then) {
          // Open travelk with travel status = "Accepted"
          When.onTheMainPage.onTable().iPressRow({ Travel: '4,133' })
          Then.onTheDetailPage.iSeeThisPage()

          When.onTheDetailPage.onHeader().iExecuteAction('Edit')
          Then.onTheDetailPage.iSeeObjectPageInEditMode()

          When.onTheDetailPage.iGoToSection('Booking')
          // Check buttons for bookings
          Then.onTheDetailPage
            .onTable({ property: 'to_Booking' })
            .iCheckDelete({ visible: false, enabled: false })
            .and.iCheckCreate({ visible: false, enabled: false })

          // Check fields
          When.onTheDetailPage.iGoToSection('Travel')
          // Starting date
          Then.onTheDetailPage
            .onForm({ section: 'Travel', fieldGroup: 'DateData' })
            .iCheckField({ property: 'BeginDate' },
              { value: 'Sep 1, 2022' },
              { editable: false })

          // Booking fee
          Then.onTheDetailPage
            .onForm({ section: 'Travel', fieldGroup: 'PriceData' })
            .iCheckField({ property: 'BookingFee' },
              { editable: false })

          When.onTheDetailPage.iGoToSection('General Information')
          When.onTheDetailPage.onTable({ property: 'to_Booking' }).iPressRow({ BookingID: '1' })

          Then.onTheDetailItemPage.iSeeThisPage()
          // Check fields
          When.onTheDetailItemPage.iGoToSection('General Information')

          // Flight Price
          Then.onTheDetailItemPage
            .onForm({ section: 'Booking', fieldGroup: 'FlightData' })
            .iCheckField({ property: 'FlightPrice' },
              { editable: false })

          // Flight Number
          Then.onTheDetailItemPage
            .onForm({ section: 'Booking', fieldGroup: 'FlightData' })
            .iCheckField({ property: 'ConnectionID' },
              { value: '0018' },
              { editable: false })

          // Check buttons for booking supplements
          When.onTheDetailItemPage.iGoToSection('Booking Supplement')
          When.onTheDetailItemPage
            .onTable({ property: 'to_BookSupplement' }).iSelectRows({ BookingSupplementID: '1' })
          Then.onTheDetailItemPage
            .onTable({ property: 'to_BookSupplement' })
            .iCheckDelete({ visible: true, enabled: false })
            .and.iCheckCreate({ visible: true, enabled: false })

          When.iNavigateBack()
          Then.onTheDetailPage.iSeeThisPage()

          When.onTheDetailPage.onFooter().iExecuteCancel()
          Then.onTheDetailPage.iSeeObjectPageInDisplayMode()

          When.iNavigateBack()
          Then.onTheMainPage.iSeeThisPage()
        }
      )

      opaTest(
        '#7: Object Page: Check details for open travel',
        function (Given, When, Then) {
          // Open travel with travel status = "open"
          When.onTheMainPage.onTable().iPressRow({ Travel: '4,129' })
          Then.onTheDetailPage.iSeeThisPage()

          When.onTheDetailPage.onHeader().iExecuteAction('Edit')
          Then.onTheDetailPage.iSeeObjectPageInEditMode()

          When.onTheDetailPage.iGoToSection('Booking')
          // Check buttons
          When.onTheDetailPage
            .onTable({ property: 'to_Booking' })
            .iSelectRows({ BookingID: '2' })
          Then.onTheDetailPage
            .onTable({ property: 'to_Booking' })
            .iCheckDelete({ visible: true, enabled: true })
            .and.iCheckCreate({ visible: true, enabled: true })

          // Check fields
          When.onTheDetailPage.iGoToSection('Travel')
          // Starting date
          Then.onTheDetailPage
            .onForm({ section: 'Travel', fieldGroup: 'DateData' })
            .iCheckField({ property: 'BeginDate' },
              { value: 'Sep 1, 2022' },
              { editable: true })

          // Booking fee
          Then.onTheDetailPage
            .onForm({ section: 'Travel', fieldGroup: 'PriceData' })
            .iCheckField({ property: 'BookingFee' },
              { editable: true })

          When.onTheDetailPage.iGoToSection('General Information')
          When.onTheDetailPage.onTable({ property: 'to_Booking' }).iPressRow({ BookingID: '2' })

          Then.onTheDetailItemPage.iSeeThisPage()
          // Check fields
          When.onTheDetailItemPage.iGoToSection('General Information')
          // Flight Price
          Then.onTheDetailItemPage
            .onForm({ section: 'Booking', fieldGroup: 'FlightData' })
            .iCheckField({ property: 'FlightPrice' },
              { editable: true })

          // Flight Number
          Then.onTheDetailItemPage
            .onForm({ section: 'Booking', fieldGroup: 'FlightData' })
            .iCheckField({ property: 'ConnectionID' },
              { value: '0018' },
              { editable: true })

          // Check buttons for booking supplements
          When.onTheDetailItemPage.iGoToSection('Booking Supplements')
          When.onTheDetailItemPage
            .onTable({ property: 'to_BookSupplement' }).iSelectRows({ BookingSupplementID: '1' })
          Then.onTheDetailItemPage
            .onTable({ property: 'to_BookSupplement' })
            .iCheckDelete({ visible: true, enabled: true })
            .and.iCheckCreate({ visible: true, enabled: true })

          When.iNavigateBack()
          Then.onTheDetailPage.iSeeThisPage()

          When.onTheDetailPage.onFooter().iExecuteCancel()
          Then.onTheDetailPage.iSeeObjectPageInDisplayMode()

          When.iNavigateBack()
          Then.onTheMainPage.iSeeThisPage()
        }
      )

      return Journey
    },
    end: function () {
      opaTest('#999: Tear down', function (Given, When, Then) {
        Given.iTearDownMyApp()
      })
      return Journey
    }
  }
  Journey.run = function () {
    Journey.start().test().end()
  }

  return Journey
})
