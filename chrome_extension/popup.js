// Hiển thị status
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
  setTimeout(() => {
    status.className = 'status';
  }, 3000);
}

// Function chạy trong trang để điền form
function fillFormPage() {
  let filled = 0;
  
  // 1. Click radio buttons (chọn ngẫu nhiên)
  document.querySelectorAll('[role="radiogroup"]').forEach(group => {
    const selected = group.querySelector('[role="radio"][aria-checked="true"]');
    if (!selected) {
      const options = group.querySelectorAll('[role="radio"]');
      if (options.length > 0) {
        const randomIdx = Math.floor(Math.random() * options.length);
        options[randomIdx].click();
        filled++;
      }
    }
  });
  
  // 2. Click checkboxes (chọn ngẫu nhiên 1-2 cái)
  const checkboxGroups = {};
  document.querySelectorAll('[role="checkbox"]').forEach(cb => {
    try {
      const parent = cb.closest('[role="group"]') || cb.closest('.freebirdFormviewerViewItemsItemItem') || cb.parentElement.parentElement;
      const key = parent ? parent.getAttribute('data-item-id') || parent.id || Math.random() : Math.random();
      if (!checkboxGroups[key]) checkboxGroups[key] = [];
      checkboxGroups[key].push(cb);
    } catch(e) {}
  });
  
  Object.values(checkboxGroups).forEach(checkboxes => {
    const unchecked = checkboxes.filter(cb => cb.getAttribute('aria-checked') === 'false');
    if (unchecked.length > 0) {
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, unchecked.length);
      const shuffled = unchecked.sort(() => Math.random() - 0.5);
      for (let i = 0; i < numToSelect; i++) {
        shuffled[i].click();
        filled++;
      }
    }
  });
  
  // 3. Điền text inputs
  document.querySelectorAll('input[type="text"], textarea').forEach(inp => {
    if (inp.offsetParent && !inp.value) {
      inp.focus();
      inp.value = 'OK';
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      filled++;
    }
  });
  
  return filled;
}

// Function chạy trong trang để click nút Tiếp
function clickNext() {
  const buttons = document.querySelectorAll('div[role="button"]');
  for (const btn of buttons) {
    const text = btn.textContent.toLowerCase();
    if (text.includes('tiếp') || text.includes('next')) {
      btn.click();
      return 'next';
    }
    if (text.includes('gửi') || text.includes('submit')) {
      return 'submit';
    }
  }
  return 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  
  // Nút điền trang này
  document.getElementById('fillBtn').addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('docs.google.com/forms')) {
        showStatus('⚠️ Hãy mở form khảo sát trước!', 'error');
        return;
      }
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: fillFormPage
      });
      
      const filled = results[0].result;
      showStatus('✅ Đã điền ' + filled + ' câu!', 'success');
    } catch (e) {
      showStatus('❌ Lỗi: ' + e.message, 'error');
    }
  });

  // Nút bấm Tiếp
  document.getElementById('nextBtn').addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('docs.google.com/forms')) {
        showStatus('⚠️ Hãy mở form khảo sát trước!', 'error');
        return;
      }
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: clickNext
      });
      
      const action = results[0].result;
      if (action === 'next') {
        showStatus('➡️ Đang chuyển trang...', 'info');
      } else if (action === 'submit') {
        showStatus('🛑 Đây là trang cuối!', 'info');
      } else {
        showStatus('⚠️ Không tìm thấy nút Tiếp', 'error');
      }
    } catch (e) {
      showStatus('❌ Lỗi: ' + e.message, 'error');
    }
  });

  // Nút điền tất cả & Tiếp
  document.getElementById('fillAllBtn').addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('docs.google.com/forms')) {
        showStatus('⚠️ Hãy mở form khảo sát trước!', 'error');
        return;
      }
      
      showStatus('🚀 Đang điền tất cả...', 'info');
      
      let pageCount = 0;
      const maxPages = 15;
      
      while (pageCount < maxPages) {
        pageCount++;
        
        // Điền trang hiện tại
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: fillFormPage
          });
        } catch (e) {
          showStatus('❌ Lỗi điền: ' + e.message, 'error');
          return;
        }
        
        // Đợi một chút
        await new Promise(r => setTimeout(r, 500));
        
        // Click nút Tiếp
        try {
          const nextResult = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: clickNext
          });
          
          const action = nextResult[0].result;
          
          if (action === 'submit') {
            showStatus('🛑 TRANG CUỐI! Hãy tự chọn và bấm Gửi.', 'info');
            return;
          } else if (action === 'none') {
            showStatus('✅ Hoàn thành ' + pageCount + ' trang!', 'success');
            return;
          }
          
          // Đợi trang load
          await new Promise(r => setTimeout(r, 1500));
          
        } catch (e) {
          showStatus('❌ Lỗi chuyển trang: ' + e.message, 'error');
          return;
        }
      }
      
      showStatus('✅ Hoàn thành ' + pageCount + ' trang!', 'success');
      
    } catch (e) {
      showStatus('❌ Lỗi: ' + e.message, 'error');
    }
  });

});
