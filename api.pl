#!/usr/bin/env perl
use Dir::Self;
use strict;
use warnings;
use Data::Dumper;
use Mojolicious::Lite;
use lib __DIR__ . "/lib";
use ILMT::Translator qw(get_translator);
use ILMT::HIN::PAN;

any '/:src/:tgt/translate' => sub {
    my $c = shift;
    my %args = %{$c->req->params->to_hash};
    my $translator = get_translator(uc($c->param('src')), uc($c->param('tgt')));
    my $final_result = $translator->translate(%args);
    if (exists $args{"pretty"}) {
        my $final_string = join "\n", map { "$_:\n$final_result->{$_}" } keys %$final_result;
        $c->render(template => 'pretty', result => $final_string);
    } else {
        $c->render(json => $final_result);
    }
};


app->start;
__DATA__

@@ pretty.html.ep
<pre><%= $result %></pre>
