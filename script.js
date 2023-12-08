
const departement = ['dep_01', 'dep_02', 'dep_03', 'dep_04', 'dep_05', 'dep_06', 'dep_07', 'dep_08', 'dep_09', 'dep_10', 'dep_11', 'dep_12', 'dep_13', 'dep_14', 'dep_15', 'dep_16', 'dep_17', 'dep_18', 'dep_19', 'dep_21', 'dep_22', 'dep_23', 'dep_24', 'dep_25', 'dep_26', 'dep_27', 'dep_28', 'dep_29', 'dep_30', 'dep_31', 'dep_32', 'dep_33', 'dep_34', 'dep_35', 'dep_36', 'dep_37', 'dep_38', 'dep_39', 'dep_40', 'dep_41', 'dep_42', 'dep_43', 'dep_44', 'dep_45', 'dep_46', 'dep_47', 'dep_48', 'dep_49', 'dep_50', 'dep_51', 'dep_52', 'dep_53', 'dep_54', 'dep_55', 'dep_56', 'dep_57', 'dep_58', 'dep_59', 'dep_60', 'dep_61', 'dep_62', 'dep_63', 'dep_64', 'dep_65', 'dep_66', 'dep_67', 'dep_68', 'dep_69', 'dep_70', 'dep_71', 'dep_72', 'dep_73', 'dep_74', 'dep_75', 'dep_76', 'dep_77', 'dep_78', 'dep_79', 'dep_80', 'dep_81', 'dep_82', 'dep_83', 'dep_84', 'dep_85', 'dep_86', 'dep_87', 'dep_88', 'dep_89', 'dep_90', 'dep_91', 'dep_92', 'dep_93', 'dep_94', 'dep_95','dep_2a', 'dep_2b']
  // Fonction exécutée lorsqu'un département est cliqué
  
  
function onClickDepartement(departement) {
    document.getElementById('').style.display = 'block';
    document.getElementById('cardreg').style.display = 'none';
}


 departement.forEach((element) => {
    document.getElementById(element).style.fill = 'rgba(190, 61, 10, 0.986)';
    document.getElementById(element).addEventListener('mouseover', function() {
      document.getElementById(element).style.fill = 'rgba(65, 194, 245, 0.986)';
    });
    document.getElementById(element).addEventListener('mouseout', function() {
        document.getElementById(element).style.fill = 'rgba(190, 61, 10, 0.986)';
    });

    document.getElementById(element).addEventListener('click', function() {

      onClickDepartement(element.replace('dep_', ''));
    });
  });


