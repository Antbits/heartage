(function ()
{
	function getPageName(path)
	{
		if (path === "/")
		{
			return "nhs:web:home";
		}
		return "nhs:web:assets" + path.replace(/\/$/, "").replace(/\//g, ":");
	}

	function getCategories(path)
	{
		return path.split("/").filter(Boolean);
	}

	(function ()
	{
		var path = document.location.pathname;
		var categories = getCategories(path);

		window.digitalData = {
			page:
			{
				category:
				{
					"primaryCategory": typeof categories[0] !== "undefined" ? categories[0] : "",
					"subCategory1": typeof categories[1] !== "undefined" ? categories[1] : "",
					"subCategory2": typeof categories[2] !== "undefined" ? categories[2] : "",
					"subCategory3": typeof categories[3] !== "undefined" ? categories[3] : ""
				},
				pageInfo:
				{
					pageName: getPageName(path)
				}
			}
		};
	})();
})(window);