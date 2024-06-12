export enum PublicMessage {
    otpSent = "کد احراز حویت ارسال شد",
    loggedIn = "شما با موفقیت وارد حساب کاربری خود شدید",
    created = "با موفقیت ایجاد شد",
    deleted = "با موفقیت حذف شد",
    updated = "با موفقیت بروزرسانی شد",
    liked = "شما این مورد را پسندیدید",
    disliked = "پسندیدن این مورد لغو شد",
    bookmarked = "شما این مورد را نشان کردید",
    unbookmarked = "نشان کردن این مورد لغو شد",
    done = "با موفقیت انجام شد",
    comment = "نظر شما با موفقیت ثبت شد",
    addedToBasket = "کتاب با موفقیت به سبد خرید اضافه شد",
    removedFromBasket = "کتاب از سبد خرید حذف شد",
    paymentSuccessfully = "خرید با موفقیت انجام شد",
}
export enum BadRequestMessage {
    invalidDiscount = "کد تخفیف اشتباه است",
    paymentFailed = "پرداخت ناموفق بود",
    countLimitation = "این تعداد از این محصول در فروشگاه موجود نیست",
    emptyBasket = "سبد خرید خالی میباشد",
    subNotExist = "این بخش نیاز مند بسته اشتراک است",
    subExpired = "بسته اشتراک شما به پایان رسیده است",
}

export enum unAuthorizedMessage {
    otpInvalid = "کد احراز حویت منقضی یا اشتباه است",
    loginAgain = "لطفا وارد حساب کاربری خود شوید",
}

export enum notFoundMessage {
    user = "کاربری با این مشخصات یافت نشد",
    author = "نویسنده ای یافت نشد",
    publisher = "ناشری یافت نشد",
    book = "کتابی یافت نشد",
    category = "دسته بندی با این مشخصات یافت نشد",
    notFound = "موردی یافت نشد",
}

export enum internalErrorMessage {
    processFailed = "خطایی رخ داد",
}

export enum conflictMessage {
    conflict = "این مورد قبلا ثبت شده است",
    comment = "نمیتوان بیشتر از یک نظر ثبت کرد",
}

export enum forbiddenMessage {
    forbidden = "شما به این بخش دسترسی ندارید",
}