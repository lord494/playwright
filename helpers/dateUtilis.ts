import fs from 'fs';

export function getWeekRange(offset = 0): string {
    const today = new Date();
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - today.getDay() + 1 + offset * 7); // ponedeljak

    const endDay = new Date(currentMonday);
    endDay.setDate(currentMonday.getDate() + 8); // 8 dana

    const formatDate = (date: Date) => {
        const days = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' }); // prva 3 slova meseca
        return `${days}${month}`;
    };

    return `${formatDate(currentMonday)} - ${formatDate(endDay)}`;
}

const COUNTER_FILE = './counter.txt';
export function generateUniqueRoleName(): string {
    let count = 1;
    if (fs.existsSync(COUNTER_FILE)) {
        const fileContent = fs.readFileSync(COUNTER_FILE, 'utf-8');
        count = parseInt(fileContent.trim()) + 1;
    }

    fs.writeFileSync(COUNTER_FILE, count.toString());

    return `playwright rola ${count}`;
}

