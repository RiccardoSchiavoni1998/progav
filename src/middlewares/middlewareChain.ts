import * as jwtMid from '../middlewares/jwtMiddleware';
import * as midGame from '../middlewares/gameMiddleware';
import * as midUser from '../middlewares/userMiddleware';

export const jwtAuthChain = [
    jwtMid.checkHeader, 
    jwtMid.checkToken, 
    jwtMid.decryptTokenAndVerifyIntegrity
]

export const newGameChain= [
    midUser.checkUserRole,
    midGame.checkNewMatchFormatRequest, 
    midUser.checkUserExistence,
    midGame.checkNewMatchContentRequest,
    midUser.checkUserTokenAmount
];

export const modifyGameChain= [
    midUser.checkUserRole,
    midGame.checkModifyMatchFormatRequest,
    midGame.checkModifyMatchContentRequest,
    midUser.checkUserTokenAmount
];

export const cpuChain = [
    midUser.checkUserRole,
    midGame.checkCpuFormatRequest,
    midGame.checkCpuContentRequest
]

export const deleteGameChain= [
    midUser.checkUserRole,
    midGame.checkStopMatchFormatRequest,
    midGame.checkStopMatchContentRequest,
    midUser.checkUserTokenAmount
];


export const getGameInfoChain = [
    midUser.checkUserRole,
    midGame.checkGetInfoMatchRequest
];


export const getShipsInfo =[
    midUser.checkUserRole,
    midGame.checkGetInfoMatchRequest,
    midGame.checkGetShipsMatchRequest
];

export const rechargeTokens = [
    midUser.checkAdminRole, 
    midUser.checkAdminFormatRequest,
    midUser.checkUserExistence
];
