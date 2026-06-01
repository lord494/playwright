export class Constants {

    // ===== TEST USERS =====
    static driverName = 'btest';
    static driverWayneJones = 'Wayne Jones';
    static driverWalfredBlanco = 'Walfred Blanco';
    static driverNameAvTrailer = 'DriverMarkoo';
    static driverTest = 'driverTest';
    static secondDriverName = 'playwrightTest';
    static driver = 'nameDriverTest';
    static secondDriver = 'secondDriver';
    static secondDriverTest = 'secondDriverPlaywright';
    static driverNameFraser = 'Fraser Carlson';
    static markLabatDriver = 'Mark Labat';
    static johnsonDriver = 'Shontavius Johnson';
    static brianDriver = 'Brian Sampley';
    static owner = '4 Aces Logistics.';
    static secondOwner = 'Ace Trans Inc.';
    static ownerTrailer = '4D Production Inc.';
    static appTestUser = 'Admin Test';
    static firstCompany = 'TC7';
    static secondSCompany = 'FY';
    static secondDispatcher = 'Pex';
    static secDis = 'scdis2';
    static firstDispatcher = 'dis4';
    static secondSubstitutleDispatcher = 'Simonovic';
    static dispatcherDispecko = 'Dispecko';
    static firtsSubstitutleDispatcher = 'QA Test';
    static playWrightUser = 'PlaywrightUser';
    static temporaryUser = 'TemporaryUser';
    static playWrightUserEmail = 'testplaywright@test.net';
    static fndPlaywrightEmail = 'fndTestplaywright@test.net';
    static wrongEmailFormat = 'test@mail.n';
    static testUser = 'TestUser';
    static testEmail = 'bosko@superegoholding.net';
    static appTest = 'AppTest';
    static password = 'playwrightpass123!';
    static appTestEmail = 'superegoholdingtest@gmail.com';
    static userName = 'Test User';

    // ===== TRUCKS =====
    static truckName = '11996';
    static secondTruckName = '4721';
    static truckNumberFM = "6461";
    static truckType = 'Truck';

    // ===== TRAILERS =====
    static trailerTest = '118185';
    static availableTrailer = '78965';
    static secondTrailerName = '243648';
    static trailerTestNumber = '130703';
    static trailerType = 'Trailer';
    static rocketCompany = 'Rocket';

    // ===== TEST DATA =====
    static test = 'bosko';
    static boskoQA = 'Bosko QA Test';
    static boskoQAEmail = 'dis@l.qq';
    static boskoQAPosition = 'SALES_TRUCK_MANAGER';
    static diss = 'dis1';
    static secondDiss = 'scdis2';
    static adminPhone = '0698751163';
    static editAdminPhone = '0631551122';
    static formatedEditAdminPhone = '(063) 155-1122';
    static formatedAdminPhone = '(069) 875-1163';
    static secondPhone = '4478030043';
    static ownerPhone = '999';
    static secondOwnerPhone = '777';
    static firstTrailerType = 'V';
    static secondTrailerType = 'S';
    static trailerTypeR = 'R';
    static noteFirst = 'Default note';
    static noteSecond = 'Changed note';
    static firtsBoard = 'B1';
    static secondBoard = 'B2';
    static snackContentHistorySuccessfullyDeleted = 'History successfully deleted';
    static extField = 'ext1';
    static extSecond = 'ext2';
    static extThird = 'ext3';
    static extFourth = 'ext4';
    static order = '1';
    static dispatcher = /Dispatcher/;
    static fndUserRole = /Fnd User/
    static teamLeadYes = 'YES';
    static newRole = 'playwright role';
    static driverPlaywright = 'driver playwright';
    static readRole = 'Read';
    static phoneNumberOfUserApp = '111111';
    static notVerifiedStatus = 'Not Verified';
    static newBoard = 'playwright board';
    static newLoadType = 'playwright load type';
    static newTrailerType = 'playwright trailer type';
    static editTrailerType = 'playwright trailer type edit';
    static makeName = 'playwright make';
    static makeVolvo = 'VOLVO';
    static model = 'VNL 760';
    static newMakeName = 'playwright make edit';
    static freightlinerOption = 'FREIGHTLINER';
    static newLoadTypeEdit = 'playwright load type Edit';
    static newBoardEdit = 'playwright board edit';
    static playwrightCompany = 'playwright company';
    static shortName = 'PW';
    static playwrightCompanyEdit = 'playwright company edit';
    static documentNameEdit = 'Document name edit';
    static shortNameEdit = 'PWE';
    static notAcitve = 'NO';
    static lessThan30Status = 'Less than 30';
    static validStatus = 'Valid';
    static expiredStatus = 'Expired';
    static companyType = 'Company';
    static driverType = 'Driver';
    static eldDocuments = 'Eld documents';
    static registrationSubtype = 'Registration';
    static otherSubtype = 'Other';
    static iftaSubtype = 'Ifta license	';
    static messageFM = 'There are no results matching your search criteria';
    static testCompany = 'testcompany';
    static stolenStatus = 'STOLEN';
    static novaYarda = 'Nova yarda';
    // Verified yards available in the Transfer modal on staging (2026-05-11):
    //   PARKING Testic Testoni, samo trailer 215, XYZ yard, Yardenko yardic
    static transferDestinationYard = 'Yardenko yardic';

    // Trailers known to have an existing available-trailer record on staging — these can be
    // re-added to /available-trailers via the UI Add flow (which is actually a PUT to
    // /api/trailers/available/{id}). Each parallel worker picks one of these by index so they
    // don't collide. If any goes stale, swap it for another existing-record trailer.
    static workerCandidateAvailableTrailers = [
        '001923',
        '002914',
        '002919',
        '002918',
        '002920',
        '002907',
    ];
    static dealership = 'testOwn';
    static oldStateValue = 'old state';
    static newStateValue = 'new state';
    static invoiceNumber = '12345';
    static amount = '500';
    static state = 'Serbia';
    static city = 'BG';
    static shopInfo = 'shop test';
    static rent = 'RENT';
    static plateNumber = '123456';
    static available = 'available';
    static vinNumber = '3HSDZAPR5PN207350';
    static castrolOliType = 'Castrol';
    static optimaOilType = 'Optima';
    static millage = '783250';
    static truckColor = 'BLUE';
    static year2022 = '2022';
    static cumminsTruckEngine = 'Cummins';
    static automaticTransmission = 'Automatic';
    static testKompanija011 = '11 Test kompanija';
    static weight = '24000';
    static suggestedRate = '700';
    static freighttincCompany = '99 FREIGHT INC';
    static deliveryCity = "East Washington, PA";
    static seconDeliveryCity = "East Los Angeles, CA";
    static addressShop = 'CA-1, Long Beach, CA 90804, United States';
    static miamiOriginCity = 'Miami, FL';
    static newYorkCity = 'New York, NY';
    static messagTitle = 'Test message title';
    static messageContent = 'Test message content';
    static dailyRepor = 'Daily report for market updates';
    static weeklyReport = 'Weekly report for market updates';
    static plawrightRecruiter = 'Playwright Regruter';
    static recruiterPetarPetrovic = 'Petar Petrovic';
    static seconPlaywrightRecruiter = 'Test Automation';
    static unemployedStatus = 'Unemployed';
    static employedStatus = 'Employed';
    static blockedStatus = 'Blocked';
    static exDriversStatus = 'EX DRIVERS';
    static holdStatus = 'Hold';
    static newYorkPostalCode = '07032';
    static chicagoPostalCode = '60007';
    static miamiPostalCode = '33178';
    static truckFranchise = 'Any truck';
    static trailerFranchise = 'Any trailer';
    static parkingFranchise = 'Parking';
    static partnerStatus = 'PARTNER';
    static platinumStatus = 'PLATINUM';
    static goldStatus = 'GOLD';
    static silverStatus = 'SILVER';
    static playwrightShopID = '/250c7c0a-b007-4153-8016-e6ee0d4e59c1';
    static shopName = 'Playwright Shop';
    static editShopName = 'Playwright Shop Edit';
    static shopWebsite = 'www.playwrightshop.com';
    static defaultCallType = 'DEFAULT';
    static problemCallType = 'PROBLEM';
    static eldPlaywright = 'playwright eld';
    static centralTimezone = 'Central';
    static salesPerson = 'Test Sales';
    static driverPlayWrightTest = 'Playwright Driver';

    // ===== COLORS =====
    static emptyNeedLoad = 'EMPTY, NEED LOAD';
    static emptyNeedLoadColor = 'rgb(183, 28, 28)';
    static loadedLoad = 'LOADED';
    static loadedLoadColor = 'rgb(76, 175, 80)';
    static dispatchedNotLoaded = 'DISPATCHED, NOT LOADED';
    static dispatchedNotLoadedColor = 'rgb(255, 238, 88)';
    static loadProblemLoad = 'LOAD PROBLEM';
    static loadProblemLoadColor = 'rgb(171, 71, 188)';
    static brokenLoad = 'BROKEN';
    static brokenLoadColor = 'rgb(13, 71, 161)';
    static specialNoteLoad = 'SPECIAL NOTE';
    static specialNoteLoadColor = 'rgba(77, 221, 225, 0.918)';
    static pmServiceLoad = 'PM SERVICE';
    static pmServiceLoadColor = 'rgb(255, 152, 0)';
    static repoLoad = 'REPO';
    static repoLoadColor = 'rgb(120, 144, 156)';
    static lotrLoad = 'L.O.T.R.';
    static lotrLoadColor = 'rgb(244, 143, 177)';
    static defaultLoad = 'DEFAULT';
    static defauktLoadColor = 'rgba(255, 235, 235, 0)';
    static dedicatedLoad = 'This load is dedicated';
    static hometimeAbsence = 'HOMETIME';
    static vacationAbsence = 'VACATION';
    static offAbsence = 'OFF';
    static noColor = 'rgba(0, 0, 0, 0)';
    static LessThan30StatusColor = 'rgb(255, 235, 59)';
    static validStatusColor = 'rgb(76, 175, 80)';
    static expiredStatusColor = 'rgb(244, 67, 54)';
    static totalDemageColor = 'rgb(228, 174, 167)';
    static unemployedStatusColor = 'rgb(255, 255, 0)';
    static holdStatusColor = 'rgb(128, 128, 128)';
    static exDriversStatusColor = 'rgb(0, 0, 255)';
    static employedStatusColor = 'rgb(0, 128, 0)';
    static blockedStatusColor = 'rgb(255, 0, 0)';
    static defaultCallTypeColor = 'rgb(13, 104, 161, 0)';

    // ===== URLS =====
    static dashboardUrl = '/dashboard';
    static user = 'USER';
    static userUrl = '/users';
    static rolesUrl = '/roles';
    static manageAppUsersUrl = '/manage-app-users';
    static fndUserUrl = '/users?role=FND_USER';
    static boardsUrl = '/boards';
    static companiesUrl = '/companies';
    static truckUrl = '/trucks/all';
    static truckInCompanyUrl = '/trucks/in_company';
    static truckThirdPartyUrl = '/trucks/is_third_party';
    static inactiveTruckUrl = '/trucks/released';
    static deletedTruckUrl = '/trucks/is_active';
    static trailerUrl = '/trailers';
    static permitBookUrl = '/permit-books';
    static loadTypesUrl = '/load-types';
    static menageFMUrl = '/menage-fm';
    static availableTrailerUrl = '/available-trailers';
    static trailerMakesUrl = '/trailers/marks';
    static trailerTypesUrl = '/trailers/types';
    static availableTrukcUrl = '/available-trucks';
    static truckMakeUrl = '/truck-make';
    static truckModelUrl = '/truck-model';
    static companiesPrebookUrl = '/pre-book/companies';
    static postLoadPrebookUrl = '/pre-book/post-loads';
    static postTruckPrebookUrl = '/pre-book/post-trucks';
    static postedTruckUrl = '/pre-book/posted-trucks';
    static driverUrl = '/drivers';
    static inactiveDriveUrl = '/drivers/deleted';
    static contactsUrl = '/contacts';
    static messageUrl = '/messages';
    static thirdPartyUrl = '/owners/third';
    static ownerUrl = '/owners/owner';
    static dealersshipUrl = '/dealerships';
    static yardUrl = '/yards';
    static recruitmentUrl = '/recruitment';
    static shopUrl = '/shop';
    static dispatchInfoUrl = '/dispatch-info';
    static eldDashboardUrl = '/eld-dashboard';
    static eldShifts = '/shifts'
    static dotInspectionUrl = '/dot-inspections';
    static eldTypesUrl = '/eld-types'

    // ===== LEASING =====
    static leasingClientsUrl = '/leasing/clients';
    static leasingClientsUrlRegex = /\/leasing\/clients$/;

    static newCompanyButtonLabel = 'New Company';
    static newOwnerOperatorButtonLabel = 'New Owner Operator';
    static exportButtonLabel = 'Export';

    static leasingClientsSearchPlaceholder = 'Search clients';
    static leasingClientsTestCompany = 'newComp';

    static leasingClientsAllRadioLabel = 'All';
    static leasingClientsActiveRadioLabel = 'Active';
    static leasingClientsInactiveRadioLabel = 'Inactive';

    static leasingClientsLeasingSalesLabel = 'Leasing Sales';
    static leasingClientsRecruitingLabel = 'Recruiting';
    static leasingClientsMaintenanceLabel = 'Maintenance';
    static leasingClientsFuelLabel = 'Fuel';

    static leasingClientsColumnName = 'Name';
    static leasingClientsColumnClientType = 'Client type';
    static leasingClientsColumnClientStatus = 'Client status';
    static leasingClientsColumnPresidents = 'Presidents';
    static leasingClientsColumnTrucks = 'Trucks';
    static leasingClientsColumnTrailers = 'Trailers';
    static leasingClientsColumnTruckTakenApproved = 'Truck - Taken/Approved';
    static leasingClientsColumnTrailerTakenApproved = 'Trailer - Taken/Approved';

    static leasingClientsApplyButtonLabel = 'Apply';
    static leasingClientsSavedFiltersDialogTitle = 'Saved Filters';
    static leasingClientsRowsPerPage10 = '10';

    static leasingClientsStatusActive = 'Active';
    static leasingClientsStatusApproved = 'Approved';
    static leasingClientsStatusInactive = 'Inactive';
    static leasingClientsStatusPending = 'Pending';
    static leasingClientsStatusDecline = 'Decline';
    static leasingClientsStatusOther = 'Other';

    // The Active / Inactive status radios each expand to a FAMILY of statuses,
    // not a single value (verified against the header-filter chip on staging
    // 2026-05-26):
    //   Active   -> Active / Active Debtor / Active Lawsuit / Active Repo /
    //               Active No Communication / Approved
    //   Inactive -> Inactive / Inactive Debtor / Inactive Settled /
    //               Inactive Lawsuit / Inactive Repo / Inactive No Communication /
    //               Decline / Pending / Other
    // Match by these keyword stems (case-sensitive `includes`) so the sub-status
    // variants are all covered. "Inactive" does NOT contain the stem "Active"
    // (capital A), so the two groups stay disjoint.
    static leasingClientsActiveStatusKeywords = ['Active', 'Approved'];
    static leasingClientsInactiveStatusKeywords = ['Inactive', 'Decline', 'Pending', 'Other'];

    static leasingClientsCheckboxChipTrueValue = "'true'";
    static leasingClientsCheckboxChipFalseValue = "'false'";

    static leasingClientsAddFilterDialogTitle = 'Add Filter Name';
    static leasingClientsSavedFiltersTableKey = 'ALL_LEASING_CLIENTS';
    static leasingClientsFiltersNameLabel = 'Filters name';
    static leasingClientsSaveButtonLabel = 'Save';

    static leasingClientsClientTypeCompany = 'Company';
    static leasingClientsPresidentValue = 'Petar Petrović';

    // ===== NEW COMPANY MODAL (Leasing Clients) =====
    static newCompanyModalTitle = 'New company';

    // Section titles inside the modal
    static newCompanySectionCompanyInfo = 'Company information';
    static newCompanySectionCooperation = 'Cooperation';
    static newCompanySectionStatus = 'Company status';
    static newCompanySectionPresident = 'President';
    static newCompanySectionContact = 'Contact';
    static newCompanySectionRepresentatives = 'Representatives';
    static newCompanySectionNote = 'Note';
    static newCompanySectionComments = 'Comments';

    // Field labels
    static newCompanyLabelClientId = 'Client ID';
    static newCompanyLabelName = 'Name*';
    static newCompanyLabelMC = 'MC';
    static newCompanyLabelDOT = 'DOT';
    static newCompanyLabelAddress = 'Address';
    static newCompanyLabelCity = 'City';
    static newCompanyLabelState = 'State';
    static newCompanyLabelZIP = 'ZIP';
    static newCompanyLabelFEIN = 'FEIN';
    static newCompanyLabelSisterCompany = 'Sister company';
    static newCompanyLabelRiskLevel = 'Risk level';
    static newCompanyLabelIsMuslim = 'Is it muslim?';
    static newCompanyLabelCooperationStartDate = 'Cooperation start date';
    static newCompanyLabelLeasingAndSales = 'Leasing and sales';
    // App contains the typo "Regruting"
    static newCompanyLabelRegruting = 'Regruting';
    static newCompanyLabelMaintenance = 'Maintenance';
    static newCompanyLabelFuel = 'Fuel';
    static newCompanyLabelSearchPresident = 'Search president';
    static newCompanyLabelContactPosition = 'Position';
    static newCompanyLabelContactName = 'Name';
    static newCompanyLabelContactEmail = 'Email';
    static newCompanyLabelContactPhone = 'Phone';
    static newCompanyLabelInvoices = 'Invoices';
    static newCompanyLabelContracts = 'Contracts';
    static newCompanyLabelInsurance = 'Insurance';
    static newCompanyLabelSalesManagerTrucks = 'Sales Manager for Trucks';
    static newCompanyLabelSalesPersTrucks = 'Sales Pers for Trucks';
    static newCompanyLabelSalesManagerTrailers = 'Sales Manager for Trailers';
    static newCompanyLabelSalesPersTrailer = 'Sales Pers for Trailer';
    static newCompanyLabelAccTeamLeader = 'Acc Team Leader';
    static newCompanyLabelAccPerson = 'Acc Person';
    static newCompanyLabelCollectionPerson = 'Collection Person';
    static newCompanyLabelNote = 'Note';

    // Add president nested modal
    static newCompanyAddPresidentButton = 'Add president';
    static newCompanyAddPresidentTitle = 'Add president';

    // Edit president nested modal (opened via the pencil icon on a president card)
    // Submit button text mirrors Add president → must be scoped to the edit dialog.
    static newCompanyEditPresidentTitle = 'Edit president';
    static newCompanyEditPresidentButton = 'Edit president';

    // Confirmation dialogs raised by the (-) and trash buttons on a president card.
    // Both share the title "Warning"; the body + action button name disambiguate them.
    static newCompanyPresidentWarningTitle = 'Warning';
    static newCompanyUnpairPresidentText = 'Are you sure that you want to remove this president from this company?';
    static newCompanyDeletePresidentText = 'Are you sure that you want to delete this president?';
    static newCompanyUnpairConfirmButton = 'Unpair';
    static newCompanyDeleteConfirmButton = 'Delete';
    static newCompanyConfirmCancelButton = 'Cancel';

    // Edit contact nested modal (opened via the pencil icon on a contact card).
    // Submit button text mirrors the dialog title — must be scoped to the dialog.
    static newCompanyEditContactTitle = 'Edit contact';
    static newCompanyEditContactButton = 'Edit contact';

    // Delete contact confirm dialog — same "Warning" title as the president
    // ones; disambiguate by body text + DELETE action button.
    static newCompanyDeleteContactText = 'Are you sure that you want to delete this contact?';
    static newCompanyPresidentLabelFirstName = 'First name*';
    static newCompanyPresidentLabelMiddleName = 'Middle name';
    static newCompanyPresidentLabelLastName = 'Last name*';
    static newCompanyPresidentLabelAddress = 'Address';
    static newCompanyPresidentLabelCity = 'City';
    static newCompanyPresidentLabelState = 'State';
    static newCompanyPresidentLabelZIP = 'ZIP';
    static newCompanyPresidentLabelSSN = 'SSN';

    static newCompanyAddContactButton = 'Add contact';
    static newCompanyCancelButton = 'Cancel';
    static newCompanySaveButton = 'Save';

    // Connection modal that opens after clicking .mdi-link-variant next to a
    // picked existing president (one that already exists on other companies).
    static newCompanyConnectionModalTitle = 'Found possible connections';
    static newCompanyConnectionTypeSamePresident = 'Connection type: Same President';
    static newCompanyConnectButton = 'Connect';
    static newCompanyDisconnectButton = 'Disconnect';
    static newCompanyRelationTypeSamePresident = 'Same President';

    // Validation
    static newCompanyValidationNameRequired = 'The name field is required';
    static newCompanyContactEmailHint = "Email won't be hidden";
    static newCompanyContactPhoneHint = "Phone won't be hidden";

    // Risk level options (from /leasing/clients New Company modal, 2026-05-18)
    static newCompanyRiskLevelA = 'A';
    static newCompanyRiskLevelB = 'B';
    static newCompanyRiskLevelC = 'C';
    static newCompanyRiskLevelD = 'D';
    static newCompanyRiskLevelF = 'F';
    static newCompanyRiskLevelL = 'L';

    // Contact Position options
    static newCompanyPositionPresident = 'President';
    static newCompanyPositionOwnerOperator = 'Owner Operator';
    static newCompanyPositionOffice = 'Office';
    static newCompanyPositionCompanyHash = 'Company #';
    static newCompanyPositionSafety = 'Safety';
    static newCompanyPositionAccounting = 'Accounting';
    static newCompanyPositionManager = 'Manager';
    static newCompanyPositionMain = 'Main';

    // Default status of a freshly created company
    static newCompanyDefaultStatus = 'Pending';

    // Sample sister company that exists on staging (2026-05-18)
    static newCompanySampleSisterCompany = 'date doo';

    // Prefix used for company names created by these tests — used to identify
    // and clean up leftovers from previous test runs.
    static newCompanyTestPrefix = 'PWNewCo';

    // ===== EDIT COMPANY / OWNER OPERATOR MODAL (Leasing Clients) =====
    // The modals opened by the pencil icon on /leasing/clients reuse the same
    // field set as the New * modals but expose Approve / Decline buttons and
    // (once status flips to Approved) a set of Underwriting / Billing /
    // Insured Collection / Receiviables-Collection / Lawsuit sections.
    static editCompanyModalTitle = 'Edit company';
    static editOwnerOperatorModalTitle = 'Edit owner';

    static editClientApproveButton = 'Approve';
    static editClientDeclineButton = 'Decline';
    // New status-transition buttons added alongside Approve/Decline. The
    // button label matches the resulting status chip text for each.
    static editClientBlacklistButton = 'Blacklist';
    static editClientInactiveButton = 'Inactive';
    // Only visible when the current status is Inactive — clicking raises a
    // native window.confirm and, on accept, flips the client back to Pending.
    static editClientReturneeButton = 'Returnee';

    // Status values displayed in the modal status chip + the /leasing/clients
    // Client status column. Verified against staging.vrlz.app 2026-05-20 —
    // the Decline button leaves a "Decline" chip (NOT "Declined" — that
    // mismatch is on the app side; pin the observed text so a regression
    // toward "Declined" surfaces here as a deliberate change).
    static editClientStatusApproved = 'Approved';
    static editClientStatusDeclined = 'Decline';
    static editClientStatusPending = 'Pending';
    static editClientStatusBlacklist = 'Blacklist';
    static editClientStatusInactive = 'Inactive';

    // Native window.confirm message raised by clicking Returnee on an
    // Inactive client.
    static editClientReturneeConfirmText = 'Are you sure that you want to return this client to pending status?';

    // Sections that only appear after the client is Approved.
    static editClientSectionUnderwriting = 'Underwriting';
    static editClientSectionBillingInfo = 'Billing info';

    // Add New (case-insensitive label on staging — chip-style buttons render
    // "ADD NEW" in upper-case but the underlying text node is "Add new").
    static editClientAddNewButton = 'Add new';

    // ===== ADD UNDERWRITING MODAL =====
    // Opened from the Edit modal Underwriting section's Add new button.
    // Modal headline is "Underwriting" (h3 inside its own v-dialog--active).
    static underwritingModalTitle = 'Underwriting';
    static underwritingLabelStatus = 'Status';
    static underwritingLabelStartDate = 'Start date';
    static underwritingLabelExpiredDate = 'Expired date';
    static underwritingLabelUnits = 'Units';
    static underwritingLabelUnitsType = 'Units type';
    static underwritingLabelApprovedBy = 'Approved By';
    static underwritingLabelNote = 'Note';
    static underwritingSaveButton = 'Save';

    // Status options inside the Add Underwriting modal (verified 2026-05-20).
    // NOTE: there is no plain "Approved" — the option that grants Truck/Trailer
    // limits is "Approved units".
    static underwritingStatusApprovedUnits = 'Approved units';
    static underwritingStatusHold = 'Hold';
    static underwritingStatusNoLimit = 'No limit';
    static underwritingStatusNoMoreUnits = 'No more units';

    // Units type options.
    static underwritingUnitsTypeTruck = 'Truck';
    static underwritingUnitsTypeTrailer = 'Trailer';

    // Approved By options.
    static underwritingApprovedByUnderwriting = 'Underwriting';
    static underwritingApprovedByPresident = 'President';

    // ===== NEW OWNER OPERATOR MODAL (Leasing Clients) =====
    static newOwnerOperatorModalTitle = 'New owner';

    // Section titles
    static newOwnerOperatorSectionOwnerInfo = 'Owner information';
    static newOwnerOperatorSectionCooperation = 'Cooperation';
    static newOwnerOperatorSectionStatus = 'Owner operator status';
    static newOwnerOperatorSectionContact = 'Contact';
    static newOwnerOperatorSectionRepresentatives = 'Representatives';
    static newOwnerOperatorSectionNote = 'Note';
    static newOwnerOperatorSectionComments = 'Comments';

    // Field labels
    static newOwnerOperatorLabelClientId = 'Client ID';
    static newOwnerOperatorLabelFirstName = 'First name*';
    static newOwnerOperatorLabelMiddleName = 'Middle name';
    static newOwnerOperatorLabelLastName = 'Last name*';
    static newOwnerOperatorLabelAddress = 'Address';
    static newOwnerOperatorLabelCity = 'City';
    static newOwnerOperatorLabelState = 'State';
    static newOwnerOperatorLabelZIP = 'ZIP';
    static newOwnerOperatorLabelSSN = 'SSN';
    static newOwnerOperatorLabelRiskLevel = 'Risk level';
    static newOwnerOperatorLabelAreTheyMuslim = 'Are they muslim?';
    static newOwnerOperatorLabelCooperationStartDate = 'Cooperation start date';
    static newOwnerOperatorLabelLeasingAndSales = 'Leasing and sales';
    static newOwnerOperatorLabelRegruting = 'Regruting';
    static newOwnerOperatorLabelMaintenance = 'Maintenance';
    static newOwnerOperatorLabelFuel = 'Fuel';
    static newOwnerOperatorLabelContactPosition = 'Position';
    static newOwnerOperatorLabelContactName = 'Name';
    static newOwnerOperatorLabelContactEmail = 'Email';
    static newOwnerOperatorLabelContactPhone = 'Phone';
    static newOwnerOperatorLabelInvoices = 'Invoices';
    static newOwnerOperatorLabelContracts = 'Contracts';
    static newOwnerOperatorLabelInsurance = 'Insurance';
    static newOwnerOperatorLabelSalesManagerTrucks = 'Sales Manager for Trucks';
    static newOwnerOperatorLabelSalesPersTrucks = 'Sales Pers for Trucks';
    static newOwnerOperatorLabelSalesManagerTrailers = 'Sales Manager for Trailers';
    static newOwnerOperatorLabelSalesPersTrailer = 'Sales Pers for Trailer';
    static newOwnerOperatorLabelAccTeamLeader = 'Acc Team Leader';
    static newOwnerOperatorLabelAccPerson = 'Acc Person';
    static newOwnerOperatorLabelCollectionPerson = 'Collection Person';
    static newOwnerOperatorLabelNote = 'Note';

    static newOwnerOperatorAddContactButton = 'Add contact';
    static newOwnerOperatorCancelButton = 'Cancel';
    static newOwnerOperatorSaveButton = 'Save';

    // Validation messages
    static newOwnerOperatorValidationFirstNameRequired = 'The First Name field is required';
    static newOwnerOperatorValidationLastNameRequired = 'The Last Name field is required';
    static newOwnerOperatorContactEmailHint = "Email won't be hidden";
    static newOwnerOperatorContactPhoneHint = "Phone won't be hidden";

    // Risk level options (same set as the New Company modal, verified 2026-05-19)
    static newOwnerOperatorRiskLevelA = 'A';
    static newOwnerOperatorRiskLevelB = 'B';
    static newOwnerOperatorRiskLevelC = 'C';
    static newOwnerOperatorRiskLevelD = 'D';
    static newOwnerOperatorRiskLevelF = 'F';
    static newOwnerOperatorRiskLevelL = 'L';

    // Contact Position options
    static newOwnerOperatorPositionPresident = 'President';
    static newOwnerOperatorPositionOwnerOperator = 'Owner Operator';
    static newOwnerOperatorPositionOffice = 'Office';
    static newOwnerOperatorPositionCompanyHash = 'Company #';
    static newOwnerOperatorPositionSafety = 'Safety';
    static newOwnerOperatorPositionAccounting = 'Accounting';
    static newOwnerOperatorPositionManager = 'Manager';
    static newOwnerOperatorPositionMain = 'Main';

    // Default status of a freshly created owner operator.
    static newOwnerOperatorDefaultStatus = 'Pending';
    // The /leasing/clients table shows owner operators with a "Owner" client-type label.
    static newOwnerOperatorClientType = 'Owner';

    // Prefix used for owner-operator first names created by these tests — for
    // identification and cleanup of leftovers from previous runs.
    static newOwnerOperatorTestPrefix = 'PWOwn';

    // Common prefix shared by ALL leasing test-created entities (companies
    // PWNewCo*, owner operators PWOwn*). Used to tell ephemeral, worker-owned
    // rows apart from stable staging data — anything starting with this is
    // transient and may be deleted mid-run by a concurrent worker's afterEach.
    static leasingTestEntityPrefix = 'PW';

    // ===== LEASING TEAMS =====
    static leasingTeamsUrl = '/leasing/leasing-teams';
    static leasingTeamsUrlRegex = /\/leasing\/leasing-teams$/;

    static leasingTeamsSelectTeamTypeLabel = 'Select leasing team type';
    static leasingTeamsSearchUsersByRoleLabel = 'Search users by role';
    static leasingTeamsCreateNewButtonLabel = 'Create New';
    static leasingTeamsMoveAllButtonLabel = 'Move All';
    static leasingTeamsDeleteTeamButtonLabel = 'Delete Team';

    static leasingTeamsSalesTruckSection = 'Sales Truck';
    static leasingTeamsSalesTrailerSection = 'Sales Trailer';
    static leasingTeamsBillingSection = 'Billing';

    static leasingTeamsCreateModalTitle = 'Create New Team';
    static leasingTeamsCreateTeamTypeLabel = 'Select team type';
    static leasingTeamsTeamNameLabel = 'Team Name';
    static leasingTeamsTeamLeadLabel = 'Team Lead';
    static leasingTeamsAddPeopleLabel = 'Add People';
    static leasingTeamsCreateButtonLabel = 'Create';
    static leasingTeamsCancelButtonLabel = 'Cancel';

    static leasingTeamsExistingTeamName = 'Sales team 1';
    static leasingTeamsRoleAdmin = 'ADMIN';
    static leasingTeamsRoleDispatcher = 'DISPATCHER';

    static leasingTeamsMoveAllModalTitle = 'Move All Members';
    static leasingTeamsMoveAllSelectTeamLabel = 'Select team to move members';
    static leasingTeamsMoveAllSubmitLabel = 'Submit';

    static leasingTeamsValidationTeamTypeRequired = 'The Team type field is required';
    static leasingTeamsValidationTeamNameRequired = 'The Team name field is required';
    static leasingTeamsValidationTeamLeadRequired = 'The Team lead field is required';

    // ===== LEASING REPRESENTATIVES =====
    static leasingRepresentativesUrl = '/leasing/representatives';
    static leasingRepresentativesUrlRegex = /\/leasing\/representatives$/;

    static leasingRepresentativesSearchLabel = 'Search representative';
    static leasingRepresentativesSearchButtonLabel = 'Search';
    static leasingRepresentativesMoveAllButtonLabel = 'Move All';
    static leasingRepresentativesUntieAllButtonLabel = 'Untie All';

    static leasingRepresentativesRoleSalesTruckManager = 'Sales Truck Manager';
    static leasingRepresentativesRoleSalesTrailerManager = 'Sales Trailer Manager';
    static leasingRepresentativesRoleAcoountingManager = 'Acoounting manager';
    static leasingRepresentativesRoleCollection = 'Collection';

    static leasingRepresentativesMoveAllDialogTitle = 'Move All Companies';
    static leasingRepresentativesMoveAllSelectLabel = 'Select representative to move companies';
    static leasingRepresentativesSubmitButtonLabel = 'Submit';
    static leasingRepresentativesCancelButtonLabel = 'Cancel';

    // Native confirm dialog messages (note: app contains typo "comanies")
    static leasingRepresentativesUntieAllConfirmText = 'Are you sure you want to untie all comanies from this representative?';
    static leasingRepresentativesChipCloseConfirmText = 'Are you sure you want to remove representative for this company?';

    static leasingRepresentativesExistingRepName = 'Bosko QA Test';
    static leasingRepresentativesSearchTerm = 'Bosko';

    // Empty reps on staging in the default Sales Truck Manager role — used as
    // safe sandboxes for mutating tests (drag/move/untie). They start with 0
    // companies, so cleanup just removes whatever the test added.
    static leasingRepresentativesEmptyRep1 = 'Managerko Trukic';
    static leasingRepresentativesEmptyRep2 = 'Sales truck manager 2';
    static leasingRepresentativesEmptyRep3 = 'sales truck test';
    static leasingRepresentativesEmptyRep4 = 'Super truck manager';
}