import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import RBSheet from 'react-native-raw-bottom-sheet';
import {udyamitaTheme} from '../../../config/styles/udyamitaTheme';
import CustomDropdown from '../../reusable/generic/CustomDropdown';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import CustomTextInput from '../../reusable/generic/CustomTextInput';
import CustomModal from '../../reusable/generic/CustomModal';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import CustomText from '../../reusable/CustomText';

const CommunitySetUp = ({
  communityDetails,
  setCommunityDetails,
  setAllowProceedToNextScreen,
}) => {
  const {t, i18n} = useTranslation();
  const [selectedVisibility, setSelectedVisibility] = useState('');
  const [modalContent, setModalContent] = useState(false);
  const [communityName, setCommunityName] = useState(null);
  const [category, setCategory] = useState(null);
  const [selectedEnterprise, setSelectedEnterprise] = useState(null);

  useEffect(() => {
    const { title, enterprise, visibility, questions } = communityDetails;
    if (visibility) {
      setSelectedVisibility(visibility);
    }
    if (enterprise) {
      setSelectedEnterprise(enterprise);
    }
    if (questions) {
      setQuestions(questions);
    }
    const allowNext =
      title &&
      enterprise &&
      visibility &&
      ((visibility || '').toLowerCase() === 'private'
        ? questions.length > 0
        : true);
    setAllowProceedToNextScreen(allowNext);
  }, [communityDetails]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editing, setEditing] = useState(false);

  const [editingQuestionindex, setEditingQuestionIndex] = useState(null);
  const [questionTyping, setQuestionTyping] = useState(false);
  const visibilityOptions = [
    {
      label: t('publicCommunity'),
      value: 'public',
      subText: t('postAndMembersOfTheCommunityCanbeViewByAnyone'),
    },
    {
      label: t('privateCommunity'),
      value: 'private',
      subText: t('postsAndMembersOfTheCommunityCanBeViewedByMembersOnly'),
    },
  ];
  // const categories = ['Education', 'Business', 'Technology'];
  const categories = ['Education', 'Business', 'Technology', 'Other'].map(
    x => ({label: x, value: x}),
  );
  const handlevisibilitySelect = visibility => {
    setSelectedVisibility(visibility);
    // changeLanguage(visibility);
    setCommunityDetails({...communityDetails, visibility: visibility});
  };

  const handleEditDeleteBottomSheetClose = () => {
    // setEditing(false);
    bottomSheetForQuestionEditorDelete.current.close();
  };

  const handleSave = que => {
    const updatedQuestions = [...questions, que];
    setQuestions(updatedQuestions);

    setQuestionTyping('');
  };
  const handleEditedQuestionSave = (que, index) => {
    let updatedQuestions = [...questions];
    updatedQuestions[index] = que;
    setQuestions(updatedQuestions);

    setEditing(false);
  };

  const updateModalContent = val => {
    const mmm = modalContent;
    modalContent.selectedOption = val;
    setModalContent(mmm);
  };
  const handleComplete = () => {
  
    setCommunityDetails({...communityDetails, questions: questions});
    bottomSheetRef.current.close();
  };
  const bottomSheetRef = useRef();
  const bottomSheetForQuestionEditorDelete = useRef();
  const handleDeleteQuestion = qIndex => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(qIndex, 1);
    setQuestions(updatedQuestions);
    handleEditDeleteBottomSheetClose();
  };
  const handleEditQuestion = qIndex => {
    
    setEditing(true);

    const selectedQuestion = questions[qIndex];
    setEditedQuestion(selectedQuestion);

    handleEditDeleteBottomSheetClose();
  };
  const openMoreInfo = qIndex => {
   

    setEditingQuestionIndex(qIndex);
    bottomSheetForQuestionEditorDelete.current.open();
  };
  const renderActionForQuestionEditOrDelete = () => (
    <View style={{padding: 20}}>
      <TouchableOpacity
        style={{alignSelf: 'flex-end'}}
        onPress={() => handleEditDeleteBottomSheetClose()}>
        <Image
          source={require('../../../assets/images/Cross.png')}
          style={styles.itemIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}
        onPress={() => handleEditQuestion(editingQuestionindex)}>
        <Image
          source={require('../../../assets/images/Editicon.png')}
          style={styles.itemIcon}
        />
        {/* <Text style={styles.itemLabel}>{t('editQuestion')}</Text> */}
        <CustomText style={styles.itemLabel} type="btn">{t('editQuestion')}</CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => handleDeleteQuestion(editingQuestionindex)}>
        <Image
          source={require('../../../assets/images/Deleteicon.png')}
          style={styles.itemIcon}
        />
        {/* <Text style={styles.itemLabel}>{t('deleteQuestion')}</Text> */}
         <CustomText style={styles.itemLabel} type='btn'>{t('deleteQuestion')}</CustomText>
      </TouchableOpacity>
    </View>
  );
  const renderAction = () => (
    <View style={{flex: 1}}>
      <View style={styles.headingContainer}>
        {/* <Text style={styles.text}>{t('membershipQuestions')}</Text> */}
        <CustomText style={styles.text} type='mlabel'>{t('membershipQuestions')}</CustomText>
        <TouchableOpacity
          style={styles.text}
          onPress={() => bottomSheetRef.current.close()}>
        <CustomText style={styles.text} type='mlabel'>X</CustomText>
          {/* <Text style={styles.text}>X</Text> */}
        </TouchableOpacity>
      </View>
      <ScrollView style={{marginBottom: 30}}>
        {questions.map((question, qIndex) => (
          <View
            key={qIndex}
            style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              {/* <Text style={styles.questionText}>
                {t('question')} {qIndex + 1}
              </Text> */}
              <CustomText style={styles.questionText} type='label'>
                {t('question')} {qIndex + 1}</CustomText>
              <TouchableOpacity onPress={() => openMoreInfo(qIndex)}>
                <Image
                  source={require('../../../assets/images/More.png')}
                  style={{width: 18, height: 18}}
                />
              </TouchableOpacity>
            </View>
            {editing && editingQuestionindex === qIndex ? (
              <>
                <TextInput
                  // placeholder={question}
                  style={[
                    styles.textInputWrap,
                    {
                      color: '#000',
                      padding: 10,
                      minHeight: 40,
                      flexWrap: 'wrap',
                      marginTop: 10,
                      backgroundColor: 'rgba(203, 203, 203, 0.1)',
                    },
                  ]}
                  value={question}
                  onChangeText={text => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[qIndex] = text;
                    setQuestions(updatedQuestions);
                  }}
                  placeholderTextColor="rgba(38, 38, 38, 0.5)"
                  placeholderStyle={{
                    fontFamily: udyamitaTheme.mainThemeFontFamily,
                  }}
                />
                <TouchableOpacity
                  style={{alignSelf: 'flex-end'}}
                  onPress={() => handleEditedQuestionSave(question, qIndex)}>
                  {/* <Text style={styles.saveBtnGreen}>{t('update')}</Text> */}
                     <CustomText style={styles.saveBtnGreen}>{t('update')}</CustomText>
                </TouchableOpacity>
              </>
            ) : (
              // <Text
              //   style={[
              //     styles.questionText,
              //     {fontFamily: udyamitaTheme.mainThemeFontFamilyMedium},
              //   ]}>
              //   {question}
              // </Text>
              <CustomText style={[
                    styles.questionText,
                    {fontFamily: udyamitaTheme.mainThemeFontFamilyMedium},
                  ]}
                  type='label'>{question}</CustomText>
            )}
          </View>
        ))}

        {questionTyping !== false ? (
          <View style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>
            {/* <Text style={styles.questionText}>
              {t('question')} {questions.length + 1}
            </Text> */}
            <CustomText
            style={styles.questionText} type='label'
            >{t('question')} {questions.length + 1}</CustomText>

            <TextInput
              placeholder={t('askAQuestion')}
              value={questionTyping}
              style={[
                styles.textInputWrap,
                {
                  color: '#000',
                  padding: 10,
                  minHeight: 40,
                  flexWrap: 'wrap',
                  marginTop: 10,
                  backgroundColor: 'rgba(203, 203, 203, 0.1)',
                },
              ]}
              onChangeText={text => {
                setQuestionTyping(text);
              }}
              placeholderTextColor="rgba(38, 38, 38, 0.5)"
              placeholderStyle={{
                fontFamily: udyamitaTheme.mainThemeFontFamily,
              }}
            />
          </View>
        ) : null}
        <TouchableOpacity
          disabled={!questionTyping}
          style={[
            styles.saveBtn,
            {
              backgroundColor: questionTyping
                ? udyamitaTheme.primaryColor
                : udyamitaTheme.disabledButtonColor,
            },
          ]}
          onPress={() => handleSave(questionTyping)}
          // onPress={() => {
          //   if (editingQuestionindex !== null) {
          //     handleSave(questionTyping, editingQuestionindex);
          //   }
          // }}
        >
          {/* <Text
            style={{
              color: 'white',
              fontSize: udyamitaTheme.themeFontSizeLabel,
              fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
            }}>
            {t('save')}
          </Text> */}
          <CustomText style={{
              color: 'white',
              fontSize: udyamitaTheme.themeFontSizeLabel,
              fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
            }} type='label'>{t('save')}</CustomText>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.completeBtn,
          {
            backgroundColor:
              questions.length === 0
                ? udyamitaTheme.disabledButtonColor
                : udyamitaTheme.primaryColor,
          },
        ]}
        disabled={questions.length === 0}
        onPress={() => handleComplete()}>
        {/* <Text
          style={{
            color: 'white',
            fontSize: udyamitaTheme.themeFontSizeLabel,
            fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
          }}>
          {t('complete')}
        </Text> */}
        <CustomText style={{
            color: 'white',
            fontSize: udyamitaTheme.themeFontSizeLabel,
            fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
          }}
          type='label'
          >{t('complete')}</CustomText>
      </TouchableOpacity>
    </View>
  );
  return (
    <View>
      {/* <Text style={styles.label}>{t('nameYourCommunity')}</Text> */}
       <CustomText style={styles.label} type='label'>{t('nameYourCommunity')}</CustomText>
      <View style={styles.textInputWrap}>
        <TextInput
          placeholder={t('giveANameToYourCommunity')}
          onChangeText={e => {
            setCommunityDetails({...communityDetails, title: e});
          }}
          value={communityDetails.title}
          style={styles.textInputStyle}
          placeholderTextColor="rgba(38, 38, 38, 0.5)"
          placeholderStyle={{
            fontFamily: udyamitaTheme.mainThemeFontFamily,
          }}
        />
      </View>

      {/* <Text style={styles.label}>{t('selectAnEntreprise')}</Text> */}
      <CustomText style={styles.label} type='label'>{t('selectAnEntreprise')}</CustomText>
      <TouchableOpacity
        style={styles.dropdownBox}
        onPress={() =>
          setModalContent({
            title: `${t('selectAnEntreprise')}`,
            selectedOption: selectedEnterprise,
            setSelectedOption: val => {
              setSelectedEnterprise(val);
              // updateModalContent(val);
              setCommunityDetails({...communityDetails, enterprise: val});
              setModalContent(false);
            },
            options: ['Beekeeping', 'Other'].map(x => ({label: x, value: x})),
          })
        }>
        {/* <Text style={styles.dropdownBoxText}>
          {selectedEnterprise ? selectedEnterprise : t('selectAnEntreprise')}
        </Text> */}
          <CustomText style={styles.dropdownBoxText} type='label'>
            {selectedEnterprise ? selectedEnterprise : t('selectAnEntreprise')}</CustomText>
        <Image
          source={require('../../../assets/images/Caretdown.png')}
          style={{width: 24, height: 24}}
        />
      </TouchableOpacity>
      {/* TBD CATEGORY  */}
      {/* <Text style={styles.label}>Select a category</Text> */}

      {/* <TouchableOpacity
        style={styles.dropdownBox}
        onPress={() =>
          setModalContent({
            title: 'Select a category',
            options: categories,
            selectedOption: selectedCategory,
            setSelectedOption: val => {
              setSelectedCategory(val);
              updateModalContent(val);
              setCommunityDetails({...communityDetails, category: val})
            },
          })
        }>
        <Text style={styles.dropdownBoxText}>
          {selectedCategory ? selectedCategory : 'Select a category'}
        </Text>
        <Image
          source={require('../../../assets/images/Caretdown.png')}
          style={{width: 24, height: 24}}
        />
      </TouchableOpacity> */}
      {/* <CustomDropdown
        selectedValue={category}
        onValueChange={itemValue => handleCategorySelect(itemValue)}
        items={categories}
        label="Select a category"
        type="dropdown"
      /> */}
      {/* <Text style={styles.label}>{t('whoCanBeAPartOfthisCommunity')}</Text> */}
       <CustomText style={styles.label} type='label'>{t('whoCanBeAPartOfthisCommunity')}</CustomText>
      <RadioForm animation={true}>
        {visibilityOptions.map((option, index) => (
          <View style={{height: 60}}>
       
            <RadioButton labelHorizontal={true}>
              <RadioButtonInput
                obj={option}
                index={index}
                isSelected={selectedVisibility === option.value}
                onPress={() => handlevisibilitySelect(option.value)}
                borderWidth={1}
                buttonInnerColor={
                  selectedVisibility === option.value
                    ? udyamitaTheme.primaryColor
                    : '#e74c3c'
                }
                buttonOuterColor={
                  selectedVisibility === option.value
                    ? udyamitaTheme.primaryColor
                    : udyamitaTheme.borderStyleColor
                }
                buttonSize={9}
                buttonOuterSize={20}
                buttonWrapStyle={{marginLeft: 10}}
              />
              {/* Radio button label */}
              <RadioButtonLabel
                obj={option}
                index={index}
                onPress={() => handlevisibilitySelect(option.value)}
                labelHorizontal={true}
                labelStyle={{
                  color:
                    selectedVisibility === option.value
                      ? udyamitaTheme.primaryColor
                      : '#000',
                  fontSize: udyamitaTheme.themeFontSizeLabel,
                  fontFamily: udyamitaTheme.mainThemeFontFamilyMedium,
                }}
                labelWrapStyle={{
                  marginLeft: 5,
                }}
              />
            </RadioButton>
            {/* <Text
              style={{
                marginLeft: 44,
                fontSize: udyamitaTheme.themeFontSizeSmallHeader,
                fontFamily: udyamitaTheme.mainThemeFontFamily,
                marginTop: -5,
                color: udyamitaTheme.textColor,
                opacity: 0.5,
              }}>
              {option.subText}
            </Text> */}
            <CustomText style={{
                marginLeft: 44,
                fontSize: udyamitaTheme.themeFontSizeSmallHeader,
                fontFamily: udyamitaTheme.mainThemeFontFamily,
                marginTop: -5,
                color: udyamitaTheme.textColor,
                opacity: 0.5,
              }} type='label'>{option.subText}</CustomText>
          </View>
        ))}
      </RadioForm>
      {selectedVisibility === 'private' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // setQuestions(['']);
            setQuestionTyping('');
            bottomSheetRef.current.open();
          }}>
          <Text style={styles.addButtonLabel}>
            {t('addMemberShipQuestions')}
          </Text>
        </TouchableOpacity>
      )}

      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={false}
        closeOnPressBack={false}
        height={windowHeight}
        duration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          },
        }}>
        {renderAction()}
      </RBSheet>
      <RBSheet
        ref={bottomSheetForQuestionEditorDelete}
        closeOnDragDown={false}
        closeOnPressBack={false}
        height={160}
        duration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          },
        }}>
        {renderActionForQuestionEditOrDelete()}
      </RBSheet>
      {modalContent ? (
        <CustomModal
          title={modalContent?.title || ''}
          options={modalContent?.options || ''}
          requestClose={() => {
            setModalContent(false);
          }}
          visible={modalContent !== false}
          selectedOption={modalContent?.selectedOption}
          setSelectedOption={modalContent?.setSelectedOption}
        />
      ) : null}
    </View>
  );
};

export default CommunitySetUp;
const styles = StyleSheet.create({
  saveBtnGreen: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.beeAppColor,
    marginTop: 15,
  },
  saveBtn: {
    width: 93,
    height: 49,
    backgroundColor: udyamitaTheme.primaryColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 20,
  },
  dropdownBoxText: {
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: 'rgba(38, 38, 38, 0.5)',
  },
  dropdownBox: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    height: 48,
    borderRadius: 6,
    //justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  questionText: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    color: udyamitaTheme.textColor,
  },
  text: {
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    color: udyamitaTheme.textColor,
    fontSize: udyamitaTheme.themeFontSizeModalLabel,
    marginLeft: 20,
    marginRight: 10,
    alignSelf: 'center',
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: udyamitaTheme.borderStyleColor,
    height: 70,
  },
  label: {
    color: udyamitaTheme.textColor,
    fontFamily: udyamitaTheme.mainThemeFontFamilyBold,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    marginTop: 15,
    marginBottom: 5,
  },
  textInputStyle: {
    //height: 40,
    fontSize: udyamitaTheme.themeFontSizeLabel,
    fontFamily: udyamitaTheme.mainThemeFontFamily,
    paddingLeft: 10,
    //alignSelf: 'center',
    // letterSpacing: 1.5,
    //width: '75%',
    color: udyamitaTheme.textColor,
    //paddingRight:10,
  },
  textInputWrap: {
    // height: 50,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: udyamitaTheme.borderStyleColor,
    //flexDirection: 'row',
    // marginTop: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    borderColor: udyamitaTheme.primaryColor,
    width: '100%',
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  addButtonLabel: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    color: udyamitaTheme.primaryColor,
  },
  completeBtn: {
    backgroundColor: udyamitaTheme.primaryColor,
    width: '90%',
    height: 52,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  itemLabel: {
    fontFamily: udyamitaTheme.mainThemeFontFamilySemiBold,
    fontSize: udyamitaTheme.themeFontSizeButton,
    color: '#000000',
  },
  itemIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
});
