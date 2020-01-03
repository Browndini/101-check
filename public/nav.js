(function() {
  window.addEventListener('load', function () {
    console.log('cool');
    document.querySelector('html').addEventListener('click', () => {
      document.querySelector('.nav-dropdown').style.display = "none";
    })
    document.querySelector('nav ul li a:not(:only-child)').addEventListener('click', function(e) {
      let dropdownStyle = this.nextSibling.style.display;
      this.nextSibling.style.display = dropdownStyle !== 'block' ? 'block' : 'none';
      // ).siblings('.nav-dropdown').toggle();
      console.log(e, this.nextSibling);
      e.stopPropagation();
    })

    document.querySelector('#nav-toggle').addEventListener('click', function() {
      const classArr = [...this.classList];
      const cool = classArr.findIndex(s => s==='active')
      cool >= 0 ? classArr.splice(cool, 1) : classArr.push('active');

      document.querySelector('#nav-toggle').setAttribute('class', classArr.join(' '));
    })

  })
})();
  // (function($) { // Begin jQuery
  //   $(function() { // DOM ready
  //     // If a link has a dropdown, add sub menu toggle.
  //     $('nav ul li a:not(:only-child)').click(function(e) {
  //       $(this).siblings('.nav-dropdown').toggle();
  //       // Close one dropdown when selecting another
  //       $('.nav-dropdown').not($(this).siblings()).hide();
  //       e.stopPropagation();
  //     });
  //     // Clicking away from dropdown will remove the dropdown class
  //     $('html').click(function() {
  //       $('.nav-dropdown').hide();
  //     });
  //     // Toggle open and close nav styles on click
  //     $('#nav-toggle').click(function() {
  //       $('nav ul').slideToggle();
  //     });
  //     // Hamburger to X toggle
  //     $('#nav-toggle').on('click', function() {
  //       this.classList.toggle('active');
  //     });
  //   }); // end DOM ready
  // })(jQuery); // end jQuery