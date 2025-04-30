import i18n from 'i18next';

import {initReactI18next} from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import kn from './kn.json';
import Bn from './bn.json';
import Or from './Or.json'
//onboarding
import onboardingEn from './onboarding/onboardingEn.json';
import onboardingHi from './onboarding/onboardingHi.json';
import onboardingKn from './onboarding/onboardingKn.json';
import onboardingMr from './onboarding/onboardingMr.json';

//profileCreation
import profileCreationEn from './profile-creation/profileCreationEn.json';
import profileCreationHi from './profile-creation/profileCreationHi.json';
import profileCreationKn from './profile-creation/profileCreationKn.json';
import profileCreationMr from './profile-creation/profileCreationMr.json';

//drawerTabs
import drawerTabsEn from './drawer-tabs/drawerTabsEn.json';
import drawerTabsHi from './drawer-tabs/drawerTabsHi.json';
import drawerTabsKn from './drawer-tabs/drawerTabsKn.json';
import drawerTabsMr from './drawer-tabs/drawerTabsMr.json';

//dashboard
import dashboardEn from './dashboard/dashboardEn.json';
import dashboardHi from './dashboard/dashboardHi.json';
import dashboardKn from './dashboard/dashboardKn.json';
import dashboardMr from './dashboard/dashboardMr.json';

import communityEn from './community/communityEn.json';
import communityHi from './community/communityHi.json';
import communityKn from './community/communityKn.json';
import communityMr from './community/communityMr.json';

import marketPlaceEn from './marketPlace/marketPlaceEn.json';
import marketPlaceKn from './marketPlace/marketPlaceKn.json';
import marketPlaceHi from './marketPlace/marketPlaceHi.json';
import marketPlaceMr from './marketPlace/marketPlaceMr.json';

import InspectHiveEn from './inspectHive/InspectHiveEn.json';
import InspectHiveKn from './inspectHive/InspectHiveKn.json';
import InspectHiveHi from './inspectHive/InspectHiveHi.json';
import InspectHiveMr from './inspectHive/InspectHiveMr.json';

import apiaryEn from './apiaryRegisteration/apiaryEn.json';
import apiaryHi from './apiaryRegisteration/apiaryHi.json';
import apiaryKn from './apiaryRegisteration/apiaryKn.json';
import apiaryMr from './apiaryRegisteration/apiaryMr.json';

import apiaryDashboardEn from './apiaryDashboard/apiaryDashboardEn.json';
import apiaryDashboardKn from './apiaryDashboard/apiaryDashboardKn.json';
import apiaryDashboardHi from './apiaryDashboard/apiaryDashboardHi.json';
import apiaryDashboardMr from './apiaryDashboard/apiaryDashboardMr.json';

import learnEn from './learn/learnEn.json';
import learnKn from './learn/learnKn.json';
import learnHi from './learn/learnHi.json';
import learnMr from './learn/learnMr.json';

import mandatoryUpdateEn from './mandatory-update/mandatory-update-en.json';
import mandatoryUpdateKn from './mandatory-update/mandatory-update-kn.json';
import mandatoryUpdateHi from './mandatory-update/mandatory-update-hi.json';
import mandatoryUpdateMr from './mandatory-update/mandatory-update-mr.json';

import pastInspectionEn from './pastInspection/pastInspectionEn.json';
import pastInspectionKn from './pastInspection/pastInspectionKn.json';
import pastInspectionHi from './pastInspection/pastInspectionHi.json';
import pastInspectionMr from './pastInspection/pastInspectionMr.json';

import teamEn from './teamManagement/teamEn.json';
import teamKn from './teamManagement/teamKn.json';
import teamHi from './teamManagement/teamHi.json';
import teamMr from './teamManagement/teamMr.json';

import udyamAiEn from './udyamAI/udyamAiEn.json';
import udyamAiHi from './udyamAI/udyamAiHi.json';
import udyamAiKn from './udyamAI/udyamAiKn.json';
import udyamAiMr from './udyamAI/udyamAiMr.json';

import apiaryMigrationEn from './apiaryMigration/apiaryMigrationEn.json';
import apiaryMigrationHi from './apiaryMigration/apiaryMigrationHi.json';
import apiaryMigrationKn from './apiaryMigration/apiaryMigrationKn.json';
import apiaryMigrationMr from './apiaryMigration/apiaryMigrationMr.json';

import harvestEn from './harvest/harvestEn.json';
import harvestkn from './harvest/harvestKn.json';
import harvestHi from './harvest/harvestHi.json';
import harvestMr from './harvest/harvestMr.json';

import incomeExpenseEn from './incomeExpense/incomeExpenseEn.json';
import incomeExpensekn from './incomeExpense/incomeExpenseKn.json';
import incomeExpenseHi from './incomeExpense/incomeExpenseHi.json';
import incomeExpenseMr from './incomeExpense/incomeExpenseMr.json';

import cropDataEn from './cropData/cropDataEn.json';
import cropDataKn from './cropData/cropDataKn.json';
import cropDataHi from './cropData/cropDataHi.json';
import cropDataMr from './cropData/cropDataMr.json';
import ReactNativeI18n from 'react-native-i18n';

const mergedTranslationsEn = {
  translation: {
    ...en.translation,

    ...onboardingEn.translation,
    ...profileCreationEn.translation,
    ...dashboardEn.translation,
    ...drawerTabsEn.translation,

    ...communityEn.translation,
    ...apiaryEn.translation,
    ...marketPlaceEn.translation,
    ...InspectHiveEn.translation,
    ...apiaryDashboardEn.translation,
    ...learnEn.translation,
    ...mandatoryUpdateEn,
    ...pastInspectionEn.translation,
    ...teamEn.translation,
    ...udyamAiEn.translation,
    ...apiaryMigrationEn.translation,

    ...harvestEn.translation,
    ...incomeExpenseEn.translation,

    ...cropDataEn.translation,
  },
};

const mergedTranslationsHi = {
  translation: {
    ...onboardingHi.translation,
    ...profileCreationHi.translation,
    ...dashboardHi.translation,
    ...drawerTabsHi.translation,

    ...hi.translation,
    ...communityHi.translation,
    ...apiaryHi.translation,
    ...InspectHiveHi.translation,
    ...teamHi.translation,
    ...learnHi.translation,
    ...mandatoryUpdateHi,
    ...marketPlaceHi.translation,
    ...pastInspectionHi.translation,
    ...udyamAiHi.translation,
    ...apiaryDashboardHi.translation,
    ...apiaryMigrationHi.translation,

    ...harvestHi.translation,
    ...incomeExpenseHi.translation,
    ...harvestHi.translation,
    ...cropDataHi.translation,
  },
};

const mergedTranslationsKn = {
  translation: {
    ...onboardingKn.translation,
    ...profileCreationKn.translation,
    ...dashboardKn.translation,
    ...drawerTabsKn.translation,

    ...kn.translation,
    ...apiaryDashboardKn.translation,
    ...apiaryKn.translation,
    ...learnKn.translation,
    ...mandatoryUpdateKn,
    ...marketPlaceKn.translation,
    ...pastInspectionKn.translation,
    ...teamKn.translation,
    ...InspectHiveKn.translation,
    ...communityKn.translation,
    ...udyamAiKn.translation,
    ...apiaryMigrationKn.translation,
    ...harvestkn.translation,
    ...incomeExpensekn.translation,
    ...cropDataKn.translation,
  },
};
const mergedTranslationsMr = {
  translation: {
    ...onboardingMr.translation,
    ...profileCreationMr.translation,
    ...dashboardMr.translation,
    ...drawerTabsMr.translation,

    ...apiaryDashboardMr.translation,
    ...apiaryMr.translation,
    ...learnMr.translation,
    ...mandatoryUpdateMr,
    ...marketPlaceMr.translation,
    ...pastInspectionMr.translation,
    ...teamMr.translation,
    ...InspectHiveMr.translation,
    ...communityMr.translation,
    ...udyamAiMr.translation,
    ...apiaryMigrationMr.translation,
    ...harvestMr.translation,
    ...incomeExpenseMr.translation,
    ...cropDataMr.translation,
  },
};
const mergedTranslationsBn = {
  translation: {
    ...Bn.translation,
  },
};
const mergedTranslationOr = {
  translation: {
    ...Or.translation
  },
};
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: ReactNativeI18n.currentLocale().substring(0, 2),
  fallbackLng: 'en',
  resources: {
    en: mergedTranslationsEn,
    hi: mergedTranslationsHi,
    kn: mergedTranslationsKn,
    mr: mergedTranslationsMr,
    bn:mergedTranslationsBn,
    or: mergedTranslationOr,
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
