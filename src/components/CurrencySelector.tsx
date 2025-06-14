
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currencies, useCurrency } from "@/contexts/CurrencyContext";

const CurrencySelector = () => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  return (
    <Select 
      value={selectedCurrency.code} 
      onValueChange={(value) => {
        const currency = currencies.find(c => c.code === value);
        if (currency) {
          setSelectedCurrency(currency);
        }
      }}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
