/**/

$("document").ready(function() {

  /* --- --- */
  // make #body visible.. after one second
  // ..because it is hidden from CSS file
  setTimeout(function() {
      $("body").css({"visibility": "visible"})
  }, 100);


  /* --- User Agent --- */
  if ((navigator.userAgent).toLowerCase().indexOf('chrome') < 0) {
    $("body").prepend(`
        <div id='warningBrowser' class='warning'>
          <i class='material-icons' style='font-size:18px;'>warning</i>&ensp; 
          <span class='text'>
            This application is optimized for Chrome browser. For best experience, please use Chrome.
          </span>
        </div>
    `);
  }


  /* --- Modal --- */

  // ..
  function handleOpenModalForProjectLinks(opener, requestData, subContent) {
    // ..
    let resource_link = opener.attr('data-resource-link');
    let request_url = `/api/${resource_link}/`;
    // ..
    fetch(request_url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        if (subContent.listType === 'group') {
          data.sort.reverse();
        }
        let comp = $(
          `<div class="comp comp_g11 ${subContent.listType}">
            <div class="head">
              <h3><span>${subContent.heading}</span></h3>
            </div>
            <div class="body"><ul></ul></div>
          </div>`
        );
        // ..
        for (let project_id of data.sort) {
          // ..
          let period = data.tree[project_id]['period'];
          let group_name = data.tree[project_id]['group_name'];
          let group_urldn = data.tree[project_id]['group_urldn'];
          let target_path = `/${group_urldn}-${period}/`;
          if (window.location.pathname !== '/') {
            // ..replace current project point with target project point
            let current_path = window.location.pathname.split('/');
            current_path = current_path.filter(point => point !== '');
            current_path[0] = `${group_urldn}-${period}`  // replace
            target_path = `/${current_path.join('/')}/`;
          }
          let listValue = subContent.listType === 'period' ? group_name : period;
          comp.find('.body ul')
            .append(
              `<li>
                <a href="${target_path}">
                  <span>${listValue}</span>
                </a>
              </li>`
            );
        }
        // ..
        $('#modal div.content > div.body').append(comp);
      })
      .catch(error => {
        console.error('Error: ', error)
      });
  }

  // ..
  $('a.modal').click(function() {
    // ..clear all elements from #modal container
    $('#modal div.content > div.body').empty();
    // ..display modal
    $('#modal').css({'display': 'flex'});
  });

  // ..
  $('#modal .close').click(function () {
      $('#modal').css({'display': 'none'});
  });

  // ..
  $('a.modal.api.period-projects').click(function() {
    let requestData = {
        period: $(this).attr('data-request-period'),
    }
    let subContent = {
      heading: `${$(this).attr('data-text')} Projects`,
      intro: ``,
      listType: 'period',
    }
    handleOpenModalForProjectLinks($(this), requestData, subContent);
  });

  // ..
  $('a.modal.api.group-projects').click(function() {
    let requestData = {
        group_urldn: $(this).attr('data-request-group-urldn'),
    }
    let subContent = {
      heading: `${$(this).attr('data-text')} <br/><span>All Projects</span>`,
      intro: ``,
      listType: 'group',
    }
    handleOpenModalForProjectLinks($(this), requestData, subContent);
  });


  /* --- Print control for long dataviz tables --- */

  $(window).on('beforeprint', function() {
    const landscape_optimized_components = [
      'div.view101b.ags02',
      'div.view117b.ags02',
      'div.view105c',
      'div.view114b',
    ];

    for (let component_class of landscape_optimized_components) {
      if ($(component_class).length) {
        alert("For optimal print display, please use landscape layout.");
        break;
      }
    }
  });

  function processTableForPrint({ original_table, original_elements_to_hide, cloned_elements_to_hide }) {

    let cloned_table_id = `${original_table.attr('id')}-clone`;

    $(window).on('beforeprint', function() {
      /*
      - warn about best print layout for certain views
      - clone table, change id of clone, and insert clone right after original
      - hide left side of original table values
      - hide right side of cloned table values
      */
      let cloned_table = original_table.clone();
      cloned_table.attr('id', cloned_table_id);
      cloned_table.insertAfter(original_table);

      for (let e of original_elements_to_hide) {
        original_table.find(e).addClass('display_none');
      }
      for (let e of cloned_elements_to_hide) {
        cloned_table.find(e).addClass('display_none');
      }
    });

    $(window).on('afterprint', function() {
      /*
      - delete cloned table
      - restore original table to initial state
      */
      let cloned_table = $(`#${cloned_table_id}`);
      cloned_table.remove();

      for (let e of original_elements_to_hide) {
        original_table.find(e).removeClass('display_none');
      }

    });

  }

  processTableForPrint({
    original_table: $('#view101b'),
    original_elements_to_hide: ['td.value.internal'],
    cloned_elements_to_hide: ['td.value.external'],
  });

  processTableForPrint({
    original_table: $('#view117b'),
    original_elements_to_hide: ['td.value.internal'],
    cloned_elements_to_hide: ['td.value.external'],
  });

  processTableForPrint({
    original_table: $('#view114b_Q235'),
    original_elements_to_hide: [
      'td.value.men',
      'td.value.women',
      'td.value.white',
      'td.value.foc',
      'td.value.asian',
      'td.value.urm',
    ],
    cloned_elements_to_hide: [
      'td.value.overall',
      'td.value.tenured',
      'td.value.pre-ten',
      'td.value.ntt',
      'td.value.full',
      'td.value.assoc',
    ],
  });

  processTableForPrint({
    original_table: $('#view114b_Q260'),
    original_elements_to_hide: [
      'td.value.men',
      'td.value.women',
      'td.value.white',
      'td.value.foc',
      'td.value.asian',
      'td.value.urm',
    ],
    cloned_elements_to_hide: [
      'td.value.overall',
      'td.value.tenured',
      'td.value.pre-ten',
      'td.value.ntt',
      'td.value.full',
      'td.value.assoc',
    ],
  });

  processTableForPrint({
    original_table: $('#view105c'),
    original_elements_to_hide: [
      'td.value.men',
      'td.value.women',
      'td.value.white',
      'td.value.foc',
      'td.value.asian',
      'td.value.urm',
    ],
    cloned_elements_to_hide: [
      'td.value.overall',
      'td.value.tenured',
      'td.value.pre_ten',
      'td.value.ntt',
      'td.value.full',
      'td.value.assoc',
    ],
  });

});



