var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
function userDelete() {
    return __awaiter(this, void 0, void 0, function () {
        var confirmPassword, userId, url, response, path, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    confirmPassword = prompt("삭제를 위해서 비밀번호를 입력해 주세요");
                    userId = window.location.pathname;
                    url = "auth".concat(userId);
                    return [4 /*yield*/, fetch(url, {
                            method: 'delete',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                password: confirmPassword
                            })
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    path = _a.sent();
                    if (path == '/') {
                        alert('삭제되었습니다.');
                        window.location.href = path;
                    }
                    else {
                        alert('비밀번호가 올바르지 않습니다.');
                        window.location.href = path;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log('err', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function nullCheck(data) {
    if (typeof (data) == null) {
        return true;
    }
    else {
        return false;
    }
}
// @ts-ignore
var form = document.getElementById('userData');
form.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
    var c;
    return __generator(this, function (_a) {
        e.preventDefault();
        c = e.submitter;
        if (c == null) {
            alert('다시 시도해 주세요');
            window.location.href = '/';
        }
        else if (c.className == 'b1') {
            userPut();
        }
        else if (c.className == 'button.b2') {
            userDelete();
        }
        return [2 /*return*/];
    });
}); });
function userPut() {
    return __awaiter(this, void 0, void 0, function () {
        var confirmData, userId, url, formData, object_1, data, response, id, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    confirmData = confirm("유저 정보 변경에 동의 하십니까?");
                    userId = window.location.pathname;
                    url = "auth".concat(userId);
                    if (!confirmData) return [3 /*break*/, 3];
                    if (!!nullCheck(form)) return [3 /*break*/, 3];
                    formData = new FormData(form);
                    object_1 = {};
                    formData.forEach(function (value, key) {
                        object_1[key] = value;
                    });
                    data = JSON.stringify(object_1);
                    console.log('data', data);
                    return [4 /*yield*/, fetch(url, {
                            method: "PUT",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: data
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    id = _a.sent();
                    window.location.href = id;
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
