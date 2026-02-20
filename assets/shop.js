document.addEventListener("DOMContentLoaded", function () {
  const productCards = document.querySelectorAll(".product-card");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartCountEl = document.querySelector(".cart-summary .cart-row:nth-child(1) span:last-child");
  const cartTotalEl = document.querySelector(".cart-summary .cart-row--total span:last-child");
  const checkoutBtn = document.querySelector(".btn-checkout");

  let cartItems = [];

  function parsePrice(text) {
   
    let onlyNumbers = text
      .replace(/تومان/g, "")
      .replace(/[,\s]/g, "");

    // تبدیل ارقام فارسی به انگلیسی
    const fa = "۰۱۲۳۴۵۶۷۸۹";
    const en = "0123456789";

    let result = "";
    for (let i = 0; i < onlyNumbers.length; i++) {
      const ch = onlyNumbers[i];
      const index = fa.indexOf(ch);
      result += index > -1 ? en[index] : ch;
    }

    const n = parseInt(result, 10);
    return isNaN(n) ? 0 : n;
  }

  function formatPrice(n) {
   
    const parts = n.toString().split("");
    let out = "";
    let count = 0;

    for (let i = parts.length - 1; i >= 0; i--) {
      out = parts[i] + out;
      count++;
      if (count === 3 && i !== 0) {
        out = "," + out;
        count = 0;
      }
    }

    const en = "0123456789";
    const fa = "۰۱۲۳۴۵۶۷۸۹";

    let faText = "";
    for (let j = 0; j < out.length; j++) {
      const c = out[j];
      const idx = en.indexOf(c);
      faText += idx > -1 ? fa[idx] : c;
    }

    return faText + " تومان";
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
      const empty = document.createElement("div");
      empty.className = "cart-item cart-item--empty";
      empty.textContent = "هنوز محصولی به سبد اضافه نشده است.";
      cartItemsContainer.appendChild(empty);
    } else {
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];

        const row = document.createElement("div");
        row.className = "cart-item";

        const titleSpan = document.createElement("span");
        titleSpan.textContent = item.title + " × " + item.qty;

        const priceSpan = document.createElement("span");
        priceSpan.textContent = formatPrice(item.price * item.qty);

        // ✅ دکمه حذف
        const removeBtn = document.createElement("button");
        removeBtn.className = "btn-remove";
        removeBtn.textContent = "حذف";

        // حذف یا کم کردن تعداد
        removeBtn.addEventListener("click", function () {
          if (item.qty > 1) {
            item.qty -= 1; 
          } else {
            cartItems.splice(i, 1); 
          }
          renderCart();
        });

        row.appendChild(titleSpan);
        row.appendChild(priceSpan);
        row.appendChild(removeBtn);

        cartItemsContainer.appendChild(row);
      }
    }

    // محاسبه مجموع
    let totalCount = 0;
    let totalPrice = 0;

    for (let k = 0; k < cartItems.length; k++) {
      totalCount += cartItems[k].qty;
      totalPrice += cartItems[k].qty * cartItems[k].price;
    }

    if (cartCountEl) {
      cartCountEl.textContent = String(totalCount);
    }

    if (cartTotalEl) {
      cartTotalEl.textContent = formatPrice(totalPrice);
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = totalCount === 0;
    }
  }

  // افزودن محصول از کارت‌ها
  for (let c = 0; c < productCards.length; c++) {
    (function (card) {
      const titleEl = card.querySelector(".product-title");
      const priceEl = card.querySelector(".product-price");
      const button = card.querySelector(".add-to-cart");

      if (!titleEl || !priceEl || !button) return;

      const title = titleEl.textContent.trim();
      const price = parsePrice(priceEl.textContent);

      button.addEventListener("click", function () {
        let found = null;

        for (let i = 0; i < cartItems.length; i++) {
          if (cartItems[i].title === title) {
            found = cartItems[i];
            break;
          }
        }

        if (found) {
          found.qty += 1;
        } else {
          cartItems.push({
            title: title,
            price: price,
            qty: 1,
          });
        }

        renderCart();
      });
    })(productCards[c]);
  }

  // دکمه ثبت سفارش
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      if (cartItems.length === 0) return;

      alert("سفارش شما ثبت شد");
      cartItems = [];
      renderCart();
    });
  }

  renderCart();
});