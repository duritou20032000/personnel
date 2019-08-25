
// const Origin = window.location.origin;
const Origin = 'http://'+window.location.hostname+'/personnel/public';
const APIV3 = Origin + '/index.php?s=';

module.exports = {
    url:Origin,
    api: {
        loginstate: `${APIV3}/Index/Login/loginstate`,
        login: `${APIV3}/Index/Login/login`,
        logout: `${APIV3}/Index/Login/loginout`,
        index: `${APIV3}/Index/Login/index`,
        menu: `${APIV3}/Index/Login/menu`,

        userlist: `${APIV3}/Index/Account/accountList`,
        rolelist: `${APIV3}/Index/Account/roleList`,
        createuser: `${APIV3}/Index/Account/createUser`,
        updateuser: `${APIV3}/Index/Account/updateUser`,
        removeuser: `${APIV3}/Index/Account/remove`,

        rolelistdetail: `${APIV3}/Index/Role/roleList`,
        tree: `${APIV3}/Index/Role/privilegeTree`,
        set_privilege: `${APIV3}/Index/Role/setPrivilege`,
        roleremove: `${APIV3}/Index/Role/remove`,

        organizationtree: `${APIV3}/Index/Organization/query`,
        createtree: `${APIV3}/Index/Organization/create`,
        updatetree: `${APIV3}/Index/Organization/update`,
        removetree: `${APIV3}/Index/Organization/remove`,

        levellist: `${APIV3}/Index/Organization/queryLevel`,
        levelupdate: `${APIV3}/Index/Organization/updateLevel`,

        homelist: `${APIV3}/Index/Company/queryHome`,
        homeset: `${APIV3}/Index/Company/setHome`,

        authlist: `${APIV3}/Index/Company/queryAuth`,
        authset: `${APIV3}/Index/Company/setAuth`,
        authadd: `${APIV3}/Index/Company/addAuth`,
        authremove: `${APIV3}/Index/Company/removeAuth`,
        upload:`${APIV3}/Index/Upload/upload`,
        uploadimage:`${APIV3}/Index/Upload/uploadImage`,

        orgemptree:`${APIV3}/Index/Employee/query`,
        uploadinfo:`${APIV3}/Index/Employee/uploadInfo`,
        exceltemplate:`${APIV3}/Index/Excel/getExcel`,
        optionlist:`${APIV3}/Index/Employee/getList`,
        empdetail:`${APIV3}/Index/Employee/empDetail`,
        updateempdetail:`${APIV3}/Index/Employee/updateEmpDetail`,

        emplist: `${APIV3}/Index/Employee/querylist`,
        filterlist:`${APIV3}/Index/Employee/getFilterList`,
        removeemp:`${APIV3}/Index/Employee/removeEmployee`,
        leaveemp:`${APIV3}/Index/Employee/leaveEmployee`,

        querytemplate :`${APIV3}/Index/Template/query`,
        savetemplate :`${APIV3}/Index/Template/save`,

        queryemplist :`${APIV3}/Index/Award/getEmpList`,
        saveawardlist:`${APIV3}/Index/Award/saveList`,

        companylist:`${APIV3}/Index/Company/getCompanyList`,
        approveco:`${APIV3}/Index/Company/approveCompany`,

        codeconfig:`${APIV3}/Index/Employee/getCodeConfig`,
        verify:`${APIV3}/Index/Index/verify`,
        indvregister:`${APIV3}/Index/Register/indvregister`,
        sendsms:`${APIV3}/Index/Register/sendSMS`,
        coregister:`${APIV3}/Index/Register/coregister`,

        getrealname:`${APIV3}/Index/Account/getRealname`,
        realname:`${APIV3}/Index/Account/realname`,
        accountreallist:`${APIV3}/Index/Account/accountRealList`,
        checkid:`${APIV3}/Index/Account/checkID`,

        coreallist:`${APIV3}/Index/Company/coRealList`,
        checkcoinfo:`${APIV3}/Index/Company/checkCoInfo`,

        getcode:`${APIV3}/Index/Login/getCode`,
        checkcode:`${APIV3}/Index/Login/checkCode`,
        codelogin:`${APIV3}/Index/Login/codeLogin`,

        exportcard:`${APIV3}/Index/Exportcard/getInfoZip`,
        sealupdate:`${APIV3}/Index/Seal/update`,
        sealquery:`${APIV3}/Index/Seal/query`,

        processquery:`${APIV3}/Index/Seal/queryProcess`,
        processupdate:`${APIV3}/Index/Seal/updateProcess`,
        deptempquery:`${APIV3}/Index/Seal/queryEmpDept`,

        createsysqrcode:`${APIV3}/Index/Codetool/createSysQrCode`,
        createqrcode:`${APIV3}/Index/Codetool/createQrCode`,
        saveqrcode:`${APIV3}/Index/Codetool/saveQrCode`,
        queryqrcode:`${APIV3}/Index/Codetool/queryQrCode`,
        readqrexcel:`${APIV3}/Index/Codetool/readQrcodeExcel`,
        exportqrexcel:`${APIV3}/Index/Codetool/exportQrcodeExcel`,

        querycard:`${APIV3}/Index/Cardinfo/queryUserInfo`,
        exportpsnl:`${APIV3}/Index/Exportcard/getPersonnelCard`,
        exportpsnlback:`${APIV3}/Index/Exportcard/getPersonnelCardBack`,
        deltemplate:`${APIV3}/Index/Template/removeTemp`,

        createaut:`${APIV3}/Index/Release/rlsAutSet`,
        queryaut:`${APIV3}/Index/Release/rlsAutQuery`,
        auditautlist:`${APIV3}/Index/Release/auditAutList`,
        auditautcheck:`${APIV3}/Index/Release/auditAutCheck`,
        auditautremove:`${APIV3}/Index/Release/auditAutRemove`,
        checkcodeaut:`${APIV3}/Index/Release/rlsAutCheckCode`,

        createnotice:`${APIV3}/Index/Release/rlsNoticeSet`,
        querynotice:`${APIV3}/Index/Release/rlsNoticeQuery`,
        auditnoticelist:`${APIV3}/Index/Release/auditNoticeList`,
        auditnoticecheck:`${APIV3}/Index/Release/auditNoticeCheck`,
        auditnoticeremove:`${APIV3}/Index/Release/auditNoticeRemove`,

        createseal:`${APIV3}/Index/Release/rlsSealSet`,
        queryseal:`${APIV3}/Index/Release/rlsSealQuery`,
        auditseallist:`${APIV3}/Index/Release/auditSealList`,
        auditsealcheck:`${APIV3}/Index/Release/auditSealCheck`,
        auditsealremove:`${APIV3}/Index/Release/auditSealRemove`,

        createfsign:`${APIV3}/Index/Release/rlsFsignSet`,
        queryfsign:`${APIV3}/Index/Release/rlsFsignQuery`,
        auditfsignlist:`${APIV3}/Index/Release/auditFsignList`,
        auditfsigncheck:`${APIV3}/Index/Release/auditFsignCheck`,
        auditfsignremove:`${APIV3}/Index/Release/auditFsignRemove`,

        createcert:`${APIV3}/Index/Release/rlsCertSet`,
        querycert:`${APIV3}/Index/Release/rlsCertQuery`,
        auditcertlist:`${APIV3}/Index/Release/auditCertList`,
        auditcertcheck:`${APIV3}/Index/Release/auditCertCheck`,
        auditcertremove:`${APIV3}/Index/Release/auditCertRemove`,

        nodetree: `${APIV3}/Index/Imagespace/query`,
        createnode: `${APIV3}/Index/Imagespace/create`,
        updatenode: `${APIV3}/Index/Imagespace/update`,
        removenode: `${APIV3}/Index/Imagespace/remove`,
        nodelist: `${APIV3}/Index/Imagespace/querylist`,
        createimage: `${APIV3}/Index/Imagespace/createImage`,
        removeimage: `${APIV3}/Index/Imagespace/removeImage`,

    },
}