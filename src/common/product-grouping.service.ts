import { ProductDto } from "src/sales-entry/dto/sales-entry.dto";

interface BillDetails {
    total: number;
    discPc: number;
    discAmt: number;
    subTotal: number;
    tax: number;
    taxAmount: number;
    netTotal: number;
    inWords: string;
}

export function arrangeProductsByCompany(products: ProductDto[]): ProductDto[][] {
    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.companyId]) {
            acc[product.companyId] = [];
        }
        acc[product.companyId].push(product);
        return acc;
    }, {} as { [key: number]: ProductDto[] });

    // Convert the object to an array of arrays
    return Object.values(groupedProducts);
}

export function calculateBillDetails(products: ProductDto[], disc: number, govTax: number): BillDetails {
    let total = 0;
    let discPc = disc; // Assuming a 5% discount, adjust as needed
    let discAmt = 0;
    let subTotal = 0;
    let tax = govTax; // Assuming 13% tax, adjust as needed
    let taxAmount = 0;
    let netTotal = 0;

    // Calculate total
    products.forEach(product => {
        total += +product.totalPrice;
    });

    console.log(total)

    // Calculate discount amount
    discAmt = (total * discPc) / 100;

    // Calculate subtotal
    subTotal = total - discAmt;

    // Calculate tax amount
    taxAmount = (subTotal * tax) / 100;

    // Calculate net total
    netTotal = subTotal + taxAmount;

    // Convert net total to words (you may want to use a library for this in a real application)
    const inWords = numberToWordsConverter(netTotal);

    return {
        total: parseFloat(total.toFixed(4)),
        discPc,
        discAmt: parseFloat(discAmt.toFixed(4)),
        subTotal: parseFloat(subTotal.toFixed(4)),
        tax,
        taxAmount: parseFloat(taxAmount.toFixed(4)),
        netTotal: parseFloat(netTotal.toFixed(4)),
        inWords
    };
}

export function numberToWordsNepali(num: number): string {
    const ones = ['', 'Ek', 'Dui', 'Tin', 'Char', 'Panch', 'Chha', 'Saat', 'Aath', 'Nau'];
    const tens = ['', '', 'Bis', 'Tis', 'Chalis', 'Pachas', 'Saathi', 'Satteri', 'Assi', 'Nabbe'];
    const teens = ['Das', 'Egara', 'Bara', 'Tera', 'Chauda', 'Pandhra', 'Sora', 'Satra', 'Athara', 'Unnais'];
    const scales = ['', 'Hajar', 'Lakh', 'Karod', 'Arab', 'Kharab'];

    function recursiveToWords(n: number): string {
        if (n === 0) return '';

        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        if (n < 1000) {
            const hundreds = Math.floor(n / 100);
            return ones[hundreds] + ' Say' + (n % 100 !== 0 ? ' ' + recursiveToWords(n % 100) : '');
        }

        for (let i = scales.length - 1; i > 0; i--) {
            const scaleValue = Math.pow(100, i);
            if (n >= scaleValue) {
                return recursiveToWords(Math.floor(n / scaleValue)) + ' ' + scales[i] +
                    (n % scaleValue !== 0 ? ' ' + recursiveToWords(n % scaleValue) : '');
            }
        }

        return '';
    }

    if (num === 0) return 'Sunya';

    const isNegative = num < 0;
    const absNum = Math.abs(num);
    const integerPart = Math.floor(absNum);
    const decimalPart = Math.round((absNum - integerPart) * 100);  // Round to 2 decimal places

    let result = recursiveToWords(integerPart);

    if (decimalPart > 0) {
        result += ' Daasamlav ' + recursiveToWords(decimalPart);
    }

    return (isNegative ? 'Rhin ' : '') + result.trim();
}

export function numberToWordsConverter(num: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const scales = ['', 'Thousand', 'Lakh', 'Crore'];

    function recursiveToWords(n: number): string {
        if (n === 0) return '';

        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + recursiveToWords(n % 100) : '');

        if (n < 100000) { // Up to 99,999
            return recursiveToWords(Math.floor(n / 1000)) + ' Thousand ' + recursiveToWords(n % 1000);
        }
        if (n < 10000000) { // Up to 99,99,999
            return recursiveToWords(Math.floor(n / 100000)) + ' Lakh ' + recursiveToWords(n % 100000);
        }
        // For numbers 1 crore and above
        return recursiveToWords(Math.floor(n / 10000000)) + ' Crore ' + recursiveToWords(n % 10000000);
    }

    if (num === 0) return 'Zero';

    const isNegative = num < 0;
    const absNum = Math.abs(num);
    const integerPart = Math.floor(absNum);
    const decimalPart = Math.round((absNum - integerPart) * 100);  // Round to 2 decimal places

    let result = recursiveToWords(integerPart);

    if (decimalPart > 0) {
        result += '.' + recursiveToWords(decimalPart);
    }

    return (isNegative ? 'Negative ' : '') + result.trim();
}


export function numberToWordsInternational(num: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion'];

    function recursiveToWords(n: number): string {
        if (n === 0) return '';

        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + recursiveToWords(n % 100) : '');

        for (let i = scales.length - 1; i > 0; i--) {
            const scaleValue = Math.pow(1000, i);
            if (n >= scaleValue) {
                return recursiveToWords(Math.floor(n / scaleValue)) + ' ' + scales[i] +
                    (n % scaleValue !== 0 ? ' ' + recursiveToWords(n % scaleValue) : '');
            }
        }

        return '';
    }

    if (num === 0) return 'Zero';

    const isNegative = num < 0;
    const absNum = Math.abs(num);
    const integerPart = Math.floor(absNum);
    const decimalPart = Math.round((absNum - integerPart) * 100);  // Round to 2 decimal places

    let result = recursiveToWords(integerPart);

    if (decimalPart > 0) {
        result += ' point ' + recursiveToWords(decimalPart);
    }

    return (isNegative ? 'Negative ' : '') + result;
}

